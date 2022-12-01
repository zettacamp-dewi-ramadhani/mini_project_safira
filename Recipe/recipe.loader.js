const DataLoader = require('dataloader');
const Ingredient = require('../Ingredient/ingredient.model');

const ingredientLoader = async(dataId)=>{
    const dataList = await Ingredient.find({
        _id : {
            $in : dataId
        }
    });
    // return dataList;
    const dataMap = {};
    dataList.forEach((data) => {
        dataMap[data._id] = data;
    })
    return dataId.map(id => dataMap[id]);
}

const recipeLoader = new DataLoader(ingredientLoader);
module.exports = recipeLoader;