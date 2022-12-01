const DataLoader = require('dataloader');
const User = require('../User/user.model');
const Recipe = require('../Recipe/recipe.model');

const userLoader = async(userId)=>{
    const getUser = await User.find({
        _id : {
            $in : userId
        }
    });

    const userMap = {};
    getUser.forEach((user)=>{
        userMap[user._id] = user;
    });
    return userId.map(id => userMap[id]);
}

const recipeLoader = async(recipeId)=>{
    const recipeData = await Recipe.find({
        _id : {
            $in : recipeId
        }
    });

    const recipeMap = {};
    recipeData.forEach((data)=>{
        recipeMap[data._id] = data;
    });
    return recipeId.map(id => recipeMap[id]);
}

const dataUserLoader = new DataLoader(userLoader);
const dataRecipeLoader = new DataLoader(recipeLoader);
module.exports = {dataUserLoader, dataRecipeLoader};