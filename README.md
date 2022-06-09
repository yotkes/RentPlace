# RentPlace
RentPlace is a P2P crowdsourcing-based platform that allows people to rent different products from other people in the community.

## Running RentPlace
- Connect to MongoDB - need to add your IP address to our MongoDB account in order to connect to the DB.
- Please contact **Yotam Hazan** in order to establish a new connection.
- For running the **server** side - in terminal go to **server** folder of the project, run **"npm install"** , then run **"npm start"**.
- For running the **client** side - in terminal go to **client** folder of the project, run **"npm install"** , then run **"npm start"**.

## On a personal note
We worked very hard on this project, and tried to think about different features (big or small) that can make it better in terms of UX/UI and crowdsourcing. Most of them we also implemented, but some were left out due to the deadline. Some of us had a little background in ReactJS, but neither of us had any previous knowledge of backend side with nodejs and mongoDB, which is why our biggest challenge was to deal with the asynchronous nature of working with this framework (and the reason why our code might be a bit different than the best practices (: ).
We learned a lot, and hope that you could also appreciate the hard work here. Thank you

## Main Features
### Registration and login
- New user can sign up to the website by filling up all his personal details, add a photo and select fields of interests.
- Existing user can login to hte system by entering email and password
- User can reset his password
### Main Dashboard
- Recommendations board with all the user's customized recommendations
- Search bar
- Search results area
- Most Wanted items list (requested by users and does not currently available in the app)
- Navigation Bar - add new product, create new request, profile, reset password, logout
- For every post that is displayed in the dashboard - the user can add it to bag, and see its details (posting user, photo, city, popularity score)
### Search Results
- Before any search is performed, all the posts are displayed below the search bar.
- Users must select category, subcategory, product name, and can also provide city and price range.
- The search results are ordered by decreasing popularity score.
### Profile
- The user's selected interests displayed, his photo (can be changed through this screen)
- 3 tabs on this screen - My products (added by this user), Shopping cart, and Purchased products
- Shopping cart - once purchased, the status of these items becomes "unavailable" so other users can't purchase
- Purchased products - for each product there are 3 possible actions: end rent, review product (on a scale of 1 to 10), review renter (on a scale of 1 to 10)
### Add New Product
- New product can be added to the system
- The price of a product is limited to 5000
- The user must fill in all details and add a photo

## DB Objects
We’ve decided to split the DB objects into  small objects for modularity and to separate between logics (ui/algorithms use). 

- **Users** - contains all the user data  in the website
- **Posts** - contains all the data for specific post (client related - e.g. photo, description, etc), each post has a field of productId that relates it to the corresponding product.
- **Products** - contain all the data of a product. Fields are more server related, such as numOfSearches, numOfRankers, and numOfApearences (the prevalence of this product in the website - how many identical products).
- **Searches** - each search object contains the userId of the searching user and the product Name that was searched.
- **RenterScores** - created for every user, and contains the needed data to calculate this user’s renter score.
- **RenterHistories** - every renting action creates this object, contains the data of this action.
- **Recommendations** - created for every user. Except for the userId, each field is a dictionary of sub-categories and their score, needed for this user’s recommendations calculation.
- **Globals** - we maintain only one object of this type, containing all the global data of the app such as the total number of searches, total number of rents etc.
- **SubCategories** - each subcategory has an object of this type with fields of its category and name.
- **Requests** - contains data of requested items by users, and the number of requests for this item.

## Algorithms

### Recommendations
A list of posts that are recommended for this user, by calculating the four following factors. Each factor determines a score between 0 to 10 for each subcategory of products, and also has  weight that will be used in the final score of every subcategory. This algorithm eventually provides a list of the top 9 popular products (highest popularity score) from the 3 subcategories with the highest calculated score (3 products per subcategory), and these products will be displayed to the user in the recommendations board.

#### Personal interests (subcategories of products) -
During registration the user must select at least 4 and at most 10 sub-categories = interests from a list. Each subcategory will receive a score:
- Subcategory from the interests of the user - score is 10
- Subcategory that is not in the user’s interest:
- User selected 1 subcategory of this category - score is 4
- User selected 2 subcategories of this category - score is 4.5
- …
- User selected 9 subcategories of this category - score is 9
- All subcategories of category that is not in the user’s interests - score is 0
	
  **Weight - 50%**
  
#### Rent history of this user - 
different items of the same category/subcategory. Calculated over all previous rents of this user, each subcategory will receive a score that is updated after every new rent by this user:
- Rented product is from the subcategory - score is 10
- Rented product is from the category but not the subcategory - score is 5
- Other subcategories - score is 0

  **Weight - 25%**

#### Rent history of other users - 
(idea: someone that rented the product also rented the following products.) 
This item will be updated after every rent by averaging the scores of the subcategories over the previous calculations.
Go over all previous rents of this user, for each rent - find all rents of other users that also rented the same product. Each subcategory will receive a score that will be averaged over all these users:
- Other user rented from this subcategory - score is 5
- Other user rented 2 products from this subcategory - score is 5.5
- …
- Other user rented 10+ products from this subcategory - score is 10

	**Weight - 15%**
  
#### Searches - 
recent searches of this user combined with rent history of other users that rented the items from these searches. This item will be updated after every search by averaging the scores of the subcategories over the previous calculations. For the current searched item of this user (how the scores are updated after every search) - find all rents of other users that also rented the same product.  Each subcategory will receive a score that will be averaged over all these users:
- Other user rented from this subcategory - score is 5
- Other user rented 2 products from this subcategory - score is 5.5
- …
- Other user rented 10+ products from this subcategory - score is 10

	**Weight - 10%**


### Renter Score
The score of every renter in the system will be calculated and updated once:
- Another user rented a product that this renter offers
- Another user left a review of this renter
- Another user left a review of a product this renter offers

The score will be calculated and updated by weighing the parameters described below.
#### Review of this renter - 
After a user reviews this renter, update the total score by averaging over the total number of reviewers.
**Weight - 40%**
#### Review of products by this renter - 
Save average score of this renter’s products reviews. After a user adds a review for one of this renter’s products, update the score by averaging.
**Weight - 20%**
#### Number of successful rents from this renter - 
The number of rents from this user. After every rent, update the total by averaging over the total number of rents in the system.
**Weight - 40%**


### Product’s popularity score
All of the following categories will be calculated into a score per product:
#### Number of searches - 
number of appearances of this product in search results. Normalized by the total number of searches in the system.
**Weight -  30%**
#### Item’s prevalence in site - 
number of identical products in the system. The prevalence of a product is averaged over the total number of products in the system. 1 - prevalence = actual score (lower prevalence = higher score). Similarity is determined by identical product name, category and subcategory.
**Weight - 40%**
#### Rank - 
the score of this product, the ranking of this product averaged over all ranking users.
**Weight - 30%**

## Algorithms Function calls by actions:
- **New renter’s review:**
  - updateRenterReviewScore = (userId, reviewScore) - update renter score
- **New product’s (post) review:**
  - updateProductReviewScore = (productId, productRank) - update renter score
- **A rent was finished** (the user Id is the user of the renter): 
  - updateNumOfRents = (userId) - update renter score
- **New search:**
  - updateNumOfSearches = (searchId) - - update product popularity score
  - updateSearches = (searchId) - update recommendations
- **New product was added:**
  - updateNumOfAppearences = (productId) - update product popularity score
- **New registration - set interests:**
  - getUserInterests = (userId) - update recommendations
- **New rent:** 
  - updateRentHistory = (renthistoryId, res) - update recommendations
  - updateOtherRentHistory = (renthistoryId, res) - update recommendations

