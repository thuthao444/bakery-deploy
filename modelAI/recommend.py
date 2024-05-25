# Phương Trang, Đỗ Trang
import numpy as np 
import pandas as pd 
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel 
import random
import os

'''
Tạo gợi ý dựa trên hành vi Người dùng:** Sử dụng dữ liệu về hành vi duyệt web và mua hàng của người dùng để gợi ý sản phẩm phù hợp.
Cập nhật mô hình gợi ý:** Mô hình gợi ý cần được cập nhật định kỳ dựa trên dữ liệu mới nhất.
'''

# Hàm tính toán gợi ý dựa trên nội dung sản phẩm
def content_based(item, df):
    # Xóa các bản ghi trùng lặp về mặt hàng
    new_data = df.drop_duplicates(subset = ['Items']).reset_index(drop=True)

    # Định nghĩa một đối tượng TfidfVectorizer để tạo ma trận TF-IDF
    tfidf = TfidfVectorizer(stop_words='english')

    # Thay thế các giá trị NaN bằng một chuỗi trống
    new_data['Description'] = new_data['Description'].fillna('')

    # Tạo ma trận TF-IDF cần thiết bằng cách fit và transform dữ liệu
    tfidf_matrix = tfidf.fit_transform(new_data['Description'])

    # Tính ma trận độ tương đồng cosine
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    # Xây dựng bản đồ nghịch đảo của chỉ số và tiêu đề sản phẩm
    indices = pd.Series(new_data.index, index=new_data['Items']).drop_duplicates()

    # Lấy chỉ số của sản phẩm phù hợp với tiêu đề
    idx = indices[item]

    # Lấy điểm tương đồng của tất cả các sản phẩm với sản phẩm đó
    sim_scores = cosine_sim[idx] 

    # Sắp xếp các sản phẩm dựa trên điểm tương đồng
    sim_scores = sorted(range(len(sim_scores)), key=lambda i: sim_scores[i], reverse=True)

    # Lấy điểm tương đồng của 10 sản phẩm tương tự nhất
    sim_scores = sim_scores[1:11]

    # Lấy chỉ số của 10 sản phẩm tương tự nhất
    items_indices = sim_scores[1:11]
    
    # Trả về 10 sản phẩm tương tự nhất
    return list(set(new_data['Items'].iloc[items_indices]))

# Hàm gợi ý dựa trên sản phẩm
def item_based(item_name, df):
    user_item_df = df.pivot_table(index=["User"], columns=["Items"], values="Rating")
    item_name_col = user_item_df[item_name]
    moveis_from_item_based = user_item_df.corrwith(item_name_col).sort_values(ascending=False)
    mask = moveis_from_item_based.index != item_name
    moveis_from_item_based = moveis_from_item_based[mask]
    return moveis_from_item_based[0:10].index.to_list()

# Hàm dự đoán xếp hạng
def predict_rating(random_user, df):
    # df = fetch_data_from_api(url)
    user_item_df = df.pivot_table(index=["User"], columns=["Items"], values="Rating")

    if random_user in user_item_df.index:
      random_user_df = user_item_df.loc[random_user]
      items_bought = random_user_df.index[random_user_df.notna()].tolist()
    else:
      items_bought = []
      
    # print("items_bought : ", items_bought)
    items_bought_df = user_item_df[items_bought] # only return items bought
    # print("item_bought_df : ", items_bought_df)
    # information on how many items each user bought in total:
    user_item_count = items_bought_df.T.notnull().sum()

    user_item_count = user_item_count.reset_index()
    user_item_count.columns = ["User","item_count"] # number of items, which random user bought, were bought by each user , max is random user
    # print("user_item_count : \n", user_item_count)
    # 12% of items bought by random user:
    perc = len(items_bought) * 12 / 100

    users_same_items = user_item_count[user_item_count["item_count"] > perc]["User"] # only calculate with users who bought more than 60% items together with random user
    # print("users_same_items :\n", users_same_items)
    final_df = items_bought_df[items_bought_df.index.isin(users_same_items)]
    # print("final_df : \n", final_df)
    # caculate corr between each pair users who bought more 60% items together with random user
    corr_df = final_df.T.corr().unstack().sort_values().drop_duplicates()
    corr_df = pd.DataFrame(corr_df, columns=["corr"])
    corr_df.index.names = ['user_1', 'user_2']
    corr_df = corr_df.reset_index()

    # print("corr_df : \n", corr_df)
    # Users with a correlation of %30 or more with random user:
    top_users = corr_df[(corr_df["user_1"] == random_user) & (corr_df["corr"] >= 0.3)][
        ["user_2", "corr"]].reset_index(drop=True) # correlation >= 40% with random user

    # print("top_users : \n", top_users)
    top_users = top_users.sort_values(by='corr', ascending=False) # corr between User and random user
    top_users.rename(columns={"user_2": "User"}, inplace=True)
    # print("top_users rename : \n", top_users)
    top_users_ratings = top_users.merge(df[["User", "Items", "Rating"]], how='inner')
    # print("top_users_ratings : \n", top_users_ratings)
    # create a dataframe that insert Items, Rating into top_users
    top_users_ratings = top_users_ratings[top_users_ratings["User"] != random_user]

    top_users_ratings['weighted_rating'] = top_users_ratings['corr'] * top_users_ratings['Rating'] # một cột mới có trọng số_đánh giá = sửa * xếp hạng
    top_users_ratings.groupby('Items').agg({"weighted_rating": "mean"}) # tính toán xếp hạng có trọng số mà người dùng ngẫu nhiên có thể xếp hạng cho các mục

    predict1 = pd.DataFrame(columns=['Items', 'Rating'])
    predict1['Items'] = top_users_ratings['Items']
    predict1['Rating'] = top_users_ratings['weighted_rating'] 
    return predict1
    
# Hàm lọc cộng tác
def CollaborativeFiltering(item, user, df):
  recommendation_df = predict_rating(user, df)
  recommendation_df = recommendation_df.reset_index()

  # các mục mà người dùng ngẫu nhiên sẽ thích
  items_to_be_recommend = recommendation_df[recommendation_df["Rating"] > 1].sort_values("Rating", ascending=False)
 
  moveis_from_item_based = item_based(item, df)

  recommend_list = items_to_be_recommend[:10]['Items'].to_list() + moveis_from_item_based
  recommend_list = list(set(recommend_list))[:10]
  recommend_list = sorted(recommend_list, key=lambda x: random.random())
  return recommend_list

# Hàm gợi ý chính
def recommend(item, user, df, isLogin = False):
    counts = df['User'].value_counts()
    if (not isLogin or counts[user] < 10):
        print("Content based + Item based")
        recommend_list = content_based(item, df) + item_based(item, df)
        recommend_list = list(set(recommend_list))[:10]
        recommend_list = sorted(recommend_list, key=lambda x: random.random())
        return recommend_list
    else:
        print("Collaborative Filtering")
        return CollaborativeFiltering(item, user, df)

