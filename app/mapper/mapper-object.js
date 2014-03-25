var path = require('path');
// var _str = require('underscore.string');
var moment = require('moment');


var modifyPrice = function(price) {
    price = price.toString();
    if (price.lastIndexOf('.') == -1) {
        return price + '.00';
    } else if (price.length - price.lastIndexOf('.') === 2) {
        return price + '0';
    } else if (price.length - price.lastIndexOf('.') > 3) {
        var newPrice = price.slice(0, price.lastIndexOf('.') + 3);
        return newPrice;
    } else {
        return price;
    }
};

module.exports = {
    productObjectMapper: function(productEntity) {
        var productObject = {};
        productObject.name = productEntity.name;
        productObject.belong = productEntity.belong;
        productObject.isShow = productEntity.isShow;
        productObject.categoryId = productEntity.categoryId;
        return productObject;
    },
    orderObjectMapper: function(orderEntity) {
        var orderObject = {};
        orderObject.id = orderEntity.id;
        orderObject.status = orderEntity.status;
        orderObject.price = modifyPrice(orderEntity.price);
        orderObject.comments = orderEntity.comments;
        orderObject.number = orderEntity.number;
        orderObject.createdTime = moment(orderEntity.created_at).format('YYYY-MM-DD HH:mm');
        orderObject.updatedTime = moment(orderEntity.updated_at).format('YYYY-MM-DD HH:mm');
        if (orderEntity.buyer) {
            orderObject.buyer = orderEntity.buyer;
        }
        if (orderEntity.item) {
            orderObject.item = this.itemObjectMapper(orderEntity.item);
        }
        if (orderEntity.store) {
            orderObject.store = this.storeObjectMapper(orderEntity.store);
        }
        return orderObject;
    },
    itemObjectMapper: function(itemEntity) {
        var itemObject = {};
        itemObject.id = itemEntity.id;
        itemObject.name = itemEntity.name;
        itemObject.imageList = JSON.parse(itemEntity.image);
        itemObject.price = modifyPrice(itemEntity.price);
        itemObject.salesVolume = itemEntity.salesVolume;
        itemObject.description = itemEntity.description;
        itemObject.keywords = itemEntity.keyWords;
        itemObject.createdTime = moment(itemEntity.created_at).format('YYYY-MM-DD HH:mm');
        itemObject.updatedTime = moment(itemEntity.updated_at).format('YYYY-MM-DD HH:mm');
        if (itemEntity.product) {
            itemObject.product = itemEntity.product;
        }
        if (itemEntity.store) {
            itemObject.store = itemEntity.store;
        }
        return itemObject;
    },
    storeObjectMapper: function(storeEntity) {
        var storeObject = {};
        storeObject.id = storeEntity.id;
        storeObject.name = storeEntity.name;
        storeObject.description = storeEntity.description;
        storeObject.address = storeEntity.address;
        storeObject.createdTime = moment(storeEntity.created_at).format('YYYY-MM-DD HH:mm');
        storeObject.updatedTime = moment(storeEntity.updated_at).format('YYYY-MM-DD HH:mm');
        if (storeEntity.owner) {
            storeObject.owner = storeEntity.owner;
        }
        return storeObject;
    },
    cartObjectMapper: function(cartEntity) {
        var cartObject = {};
        cartObject.id = cartEntity.id;
        cartObject.createdTime = moment(cartEntity.created_at).format('YYYY-MM-DD HH:mm');
        cartObject.updatedTime = moment(cartEntity.updated_at).format('YYYY-MM-DD HH:mm');
        if (cartEntity.buyer) {
            cartObject.buyer = cartEntity.buyer;
        }
        if (cartEntity.item) {
            cartObject.item = this.itemObjectMapper(cartEntity.item);
        }
        if (cartEntity.store) {
            cartObject.store = this.storeObjectMapper(cartEntity.store);
        }
        return cartObject;
    }
};