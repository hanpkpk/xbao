var Sequelize = require("sequelize");
var path = require('path');
var sequelize = new Sequelize('xbao', 'root', '1234', {
    define: {
        freezeTableName: true,
        underscored: true,
        timestaps: false
    }
});

sequelize.authenticate().complete(function(err) {
    if ( !! err) {
        console.log('Unable to connect to the database:', err);
    } else {
        console.log('Connection has been established successfully.');
    }
});

var category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

var product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    belong: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isShow: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

var user = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    account: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    isSeller: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    credit: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '0,0'
    },
    headImg: {
        type: Sequelize.STRING,
        defaultValue: '/static/img/headImg.jpg'
    },
    address: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

var store = sequelize.define('store', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: Sequelize.TEXT,
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

var goods = sequelize.define('goods', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING(1024),
        allowNull: false
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    salesVolume: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    description: Sequelize.TEXT,
    keyWords: Sequelize.STRING
});

var orders = sequelize.define('orders', {
    id: {
        type: Sequelize.STRING(32),
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    comments: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    number: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});
var comments = sequelize.define('comments', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});
var cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }
});

product.belongsTo(category, {
    as: 'category',
    foreignKey: 'categoryId'
});

store.belongsTo(user, {
    as: 'owner',
    foreignKey: 'ownerId'
});

store.belongsTo(category, {
    as: 'category',
    foreignKey: 'categoryId'
});

goods.belongsTo(store, {
    as: 'store',
    foreignKey: 'storeId'
}).belongsTo(product, {
    as: 'product',
    foreignKey: 'product_id'
});

orders.belongsTo(user, {
    as: 'buyer',
    foreignKey: 'buyer_id'
}).belongsTo(goods, {
    as: 'item',
    foreignKey: 'item_id'
}).belongsTo(store, {
    as: 'store',
    foreignKey: 'store_id'
});

comments.belongsTo(user, {
    as: 'buyer',
    foreignKey: 'buyer_id'
}).belongsTo(goods, {
    as: 'item',
    foreignKey: 'item_id'
});

cart.belongsTo(user, {
    as: 'buyer',
    foreignKey: 'buyer_id'
}).belongsTo(user, {
    as: 'item',
    foreignKey: 'item_id'
});

sequelize.sync({
    force: false
}).success(function() {
    console.log('ok');
}).error(function(err) {
    console.log(err);
});

module.exports = {
    category: category,
    product: product,
    user: user,
    store: store,
    goods: goods,
    orders: orders,
    cart: cart,
    comments: comments
};