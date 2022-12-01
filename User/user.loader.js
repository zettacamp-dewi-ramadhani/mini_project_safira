const DataLoader = require('dataloader');
const Permission = require('../Permission/permission.model');

const typeLoader = async(typeId)=>{
    const dataList = await Permission.find({
        _id : {
            $in : typeId
        }
    });

    const dataMap = {};
    dataList.forEach((data) => {
        dataMap[data._id] = data;
    })
    return typeId.map(id => dataMap[id]);
}

const userTypeLoader = new DataLoader(typeLoader);
module.exports = userTypeLoader