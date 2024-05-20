# from pymongo import MongoClient
import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel 
import random
import os

'''
Tạo gợi ý dựa trên hành vi Người dùng:** Sử dụng dữ liệu về hành vi duyệt web và mua hàng của người dùng để gợi ý sản phẩm phù hợp.
Cập nhật mô hình gợi ý:** Mô hình gợi ý cần được cập nhật định kỳ dựa trên dữ liệu mới nhất.
'''
def content_based(item, df):
    new_data = df.drop_duplicates(subset = ['Items']).reset_index(drop=True)

    #Define a TF-IDF Vectorizer Object. Remove all english stop words such as 'the', 'a'
    tfidf = TfidfVectorizer(stop_words='english')

    #Replace NaN with an empty string
    new_data['Description'] = new_data['Description'].fillna('')

    #Construct the required TF-IDF matrix by fitting and transforming the data
    tfidf_matrix = tfidf.fit_transform(new_data['Description'])

    # Compute the cosine similarity matrix
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    #Construct a reverse map of indices and movie titles
    indices = pd.Series(new_data.index, index=new_data['Items']).drop_duplicates()

    # Get the index of the movie that matches the title
    idx = indices[item]

    # Get the pairwsie similarity scores of all movies with that movie
    sim_scores = cosine_sim[idx] 

    # Sort the movies based on the similarity scores
    sim_scores = sorted(range(len(sim_scores)), key=lambda i: sim_scores[i], reverse=True)

    # Get the scores of the 10 most similar movies
    sim_scores = sim_scores[1:11]

    items_indices = sim_scores[1:11]
    
    # Return the top 10 most similar movies
    return list(set(new_data['Items'].iloc[items_indices]))

def item_based(item_name, df):
    user_item_df = df.pivot_table(index=["User"], columns=["Items"], values="Rating")
    item_name_col = user_item_df[item_name]
    moveis_from_item_based = user_item_df.corrwith(item_name_col).sort_values(ascending=False)
    mask = moveis_from_item_based.index != item_name
    moveis_from_item_based = moveis_from_item_based[mask]
    return moveis_from_item_based[0:10].index.to_list()

def CollaborativeFiltering(item_name, random_user, df):
    # df = fetch_data_from_api(url)
    user_item_df = df.pivot_table(index=["User"], columns=["Items"], values="Rating")
    # item_name1 = user_item_df[item_name]
    random_user_df = user_item_df[user_item_df.index == random_user]
    items_bought = random_user_df.columns[random_user_df.notna().any()].tolist() # items which random user bought
    items_bought_df = user_item_df[items_bought] # only return items bought

    # information on how many items each user bought in total:
    user_item_count = items_bought_df.T.notnull().sum()
                                                             
    user_item_count = user_item_count.reset_index()
    user_item_count.columns = ["User","item_count"] # number of items, which random user bought, were bought by each user , max is random user
    
    # 60% of items bought by random user:
    perc = len(items_bought) * 60 / 100 

    users_same_items = user_item_count[user_item_count["item_count"] > perc]["User"] # only calculate with users who bought more than 60% items together with random user 
    final_df = items_bought_df[items_bought_df.index.isin(users_same_items)]
    
    # caculate corr between each pair users who bought more 60% items together with random user
    corr_df = final_df.T.corr().unstack().sort_values().drop_duplicates()
    corr_df = pd.DataFrame(corr_df, columns=["corr"])
    corr_df.index.names = ['user_1', 'user_2']
    corr_df = corr_df.reset_index()

    # Users with a correlation of %30 or more with random user:
    top_users = corr_df[(corr_df["user_1"] == random_user) & (corr_df["corr"] >= 0.3)][
        ["user_2", "corr"]].reset_index(drop=True) # correlation >= 40% with random user 

    top_users = top_users.sort_values(by='corr', ascending=False) # corr between User and random user
    top_users.rename(columns={"user_2": "User"}, inplace=True)

    top_users_ratings = top_users.merge(df[["User", "Items", "Rating"]], how='inner')

    # create a dataframe that insert Items, Rating into top_users
    top_users_ratings = top_users_ratings[top_users_ratings["User"] != random_user]

    top_users_ratings['weighted_rating'] = top_users_ratings['corr'] * top_users_ratings['Rating'] # a new column weighted_rating = corr * ratings
    top_users_ratings.groupby('Items').agg({"weighted_rating": "mean"}) # caculate weighted ratings which random user can rate for items 

    recommendation_df = top_users_ratings.groupby('Items').agg({"weighted_rating": "mean"})
    recommendation_df = recommendation_df.reset_index()

    # items which random user will like:
    items_to_be_recommend = recommendation_df[recommendation_df["weighted_rating"] > 1].sort_values("weighted_rating", ascending=False)

    item_name_col = user_item_df[item_name]
    moveis_from_item_based = user_item_df.corrwith(item_name_col).sort_values(ascending=False)
    mask = moveis_from_item_based.index != item_name
    moveis_from_item_based = moveis_from_item_based[mask]

    recommend_list = items_to_be_recommend[:10]['Items'].to_list() + moveis_from_item_based[0:10].index.to_list() + moveis_from_item_based[0:10].index.to_list()
    recommend_list = list(set(recommend_list))[:10]
    recommend_list = sorted(recommend_list, key=lambda x: random.random())
    return recommend_list

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

# test
cd = os.getcwd()
print(os.path.dirname(cd))
data_path = os.path.join(os.path.dirname(cd), 'modelAI\\data')
print(data_path)
df = pd.read_csv(os.path.join(data_path, 'data.csv')) 
test = recommend('Toast', 'Adam', df, True)
print("test: ", test)