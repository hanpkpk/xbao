var async = require('async');
var xbao = require('../models/entity-manager.js');
var category = xbao.category;
var product = xbao.product;

var createProduct = function(belong, name, isShow, categoryId) {
    product.create({
        belong: belong,
        name: name,
        isShow: isShow,
        categoryId: categoryId
    }).error(function(err) {
        console.log(err);
    });
};

async.series([

    function(cb) {
        var categoryArray = ['服装内衣', '鞋包配饰', '饰品手表', '家电', '手机数码', '家纺', '家具', '食品', '日用百货'];
        async.eachSeries(categoryArray, function(item, callback) {
            category.create({
                name: item
            }).success(function() {
                callback();
            }).error(function(err) {
                console.log(err);
                callback(err);
            });
        }, function(err) {
            cb(err);
        });
    },
    function(cb) {


        //初始化cloth栏目
        var femaleClothArray = ['T恤', '衬衫', '针织衫', '马甲', '外套', '羽绒服', '卫衣', '棉衣', '吊带衫', '唐装', '职业装'];
        var femalePantsArray = ['休闲裤', '连体裤', '西装裤', '牛仔裤', '棉裤', '中裤', '羽绒裤', '哈伦裤', '铅笔裤', '背带'];
        var femaleUnderwearArray = ['聚拢文胸', '调整型文胸', '文胸套装', '三角裤', '平角裤', '丁字裤', '基础内衣', '保暖内衣', '睡衣', '塑身衣', '袜子'];
        var maleClothArray = ['T恤', '衬衫', '针织衫', '皮衣', '羽绒服', '西装', '马甲', '唐装', '中山装', '背心', '大衣'];
        var malePantsArray = ['休闲裤', '牛仔裤', '西装裤', '工装裤', '短裤', '棉裤', '九分裤', '哈伦裤', '羽绒裤'];
        var maleUnderwearArray = ['平角裤', '三角裤', '棉内裤', '背心', '睡衣', '基础内衣', '棉制内衣', '保暖裤', '袜子'];

        category.find({
            where: {
                name: '服装内衣'
            }
        }).success(function(cate) {
            for (var i = 0; i < femaleClothArray.length; i++) {
                createProduct('女士上衣', femaleClothArray[i], true, cate.id);
            }
            for (var i = 0; i < femalePantsArray.length; i++) {
                createProduct('女士裤装', femalePantsArray[i], true, cate.id);
            }
            for (var i = 0; i < femaleUnderwearArray.length; i++) {
                createProduct('女士内衣', femaleUnderwearArray[i], true, cate.id);
            }
            for (var i = 0; i < maleClothArray.length; i++) {
                createProduct('男士上装', maleClothArray[i], true, cate.id);
            }
            for (var i = 0; i < malePantsArray.length; i++) {
                createProduct('男士裤装', malePantsArray[i], true, cate.id);
            }
            for (var i = 0; i < maleUnderwearArray.length; i++) {
                createProduct('男士内衣', maleUnderwearArray[i], true, cate.id);
            }
        });

        //初始化shoes栏目
        var femaleShoes = ['单鞋', '高帮鞋', '高跟鞋', '靴子', '雪地靴', '高筒靴', '弹力靴', '过膝长靴', '内增高', '帆布鞋', '豆豆鞋', '松糕鞋', '真皮单鞋'];
        var maleShoes = ['工装靴', '马丁靴', '雪地靴', '棉鞋', '帆布鞋', '豆豆鞋', '休闲皮鞋', '高帮鞋', '帆船鞋', '增高鞋'];
        var bag = ['单肩', '手提', '斜跨', '腰包', '帆布', '真皮', '尼龙', '钱包', '卡包', '双肩包', 'PU', '印花', '链条', '旅行箱包'];
        var ornament = ['丝巾', '围巾', '披肩', '领带', '腰带', '帽子', '手套'];

        category.find({
            where: {
                name: '鞋包配饰'
            }
        }).success(function(cate) {
            for (var i = 0; i < femaleShoes.length; i++) {
                createProduct('女鞋', femaleShoes[i], true, cate.id);
            }
            for (var i = 0; i < maleShoes.length; i++) {
                createProduct('男鞋', maleShoes[i], true, cate.id);
            }
            for (var i = 0; i < bag.length; i++) {
                createProduct('皮包', bag[i], true, cate.id);
            }
            for (var i = 0; i < ornament.length; i++) {
                createProduct('配饰', ornament[i], true, cate.id);
            }
        });

        //初始化ornament栏目
        var jewelryArray = ['翡翠', '黄金', '琥珀', '钻石', '彩色宝石', '玉石', '珍珠', '铂金', '戒指', '手链', '吊坠', '项链', '手镯', '钻戒', '金条'];
        var popularJewelry = ['发饰', '耳钉', '摆件', '首饰盒', '耳环', '发箍', '水晶', '对戒', '胸针', '玛瑙', '银饰', '银手镯'];
        var watchArray = ['石英表', '机械表', '光能表', '电子表', '男表', '女表', '中性表', '对表', '儿童表', '怀表', '手表配件'];
        var glassesArray = ['太阳眼镜', '眼镜架', '眼镜片', '滴眼液', '3D眼镜', '隐形眼镜盒', '电脑护目镜', '镜盒', '老花镜', '防辐射眼镜', '游泳镜', '滑雪镜'];

        category.find({
            where: {
                name: '饰品手表'
            }
        }).success(function(cate) {
            for (var i = 0; i < jewelryArray.length; i++) {
                createProduct('珠宝首饰', jewelryArray[i], true, cate.id);
            }
            for (var i = 0; i < popularJewelry.length; i++) {
                createProduct('流行首饰', popularJewelry[i], true, cate.id);
            }
            for (var i = 0; i < watchArray.length; i++) {
                createProduct('手表', watchArray[i], true, cate.id);
            }
            for (var i = 0; i < glassesArray.length; i++) {
                createProduct('眼镜', glassesArray[i], true, cate.id);
            }
        });

        //初始化appliance栏目
        var appliance = ['平板电脑', '电视', '冰箱', '空调', '洗衣机', '油烟机', '消毒柜', '热水器', '家庭影院', '电子酒柜'];
        var liftAppliance = ['除湿机', '加湿器', '扫地机', '吸尘器', '空气净化', '干衣机', '电熨斗', '电风扇', '电热毯', '电话机', '电暖气'];
        var audio = ['耳机', '网络播放器', '影碟机', '音箱', '话筒', '扩音器', '收录机', '收音机'];
        var kitchenAppliance = ['电烤箱', '微波炉', '饮水机', '电炸锅', '打蛋器', '电热锅', '净水器', '电热水壶', '榨汁机', '咖啡机', '电磁炉', '面包机', '电饭煲', '豆浆机', '电压力锅'];

        category.find({
            where: {
                name: '家电'
            }
        }).success(function(cate) {
            for (var i = 0; i < appliance.length; i++) {
                createProduct('大家电', appliance[i], true, cate.id);
            }
            for (var i = 0; i < liftAppliance.length; i++) {
                createProduct('生活电器', liftAppliance[i], true, cate.id);
            }
            for (var i = 0; i < audio.length; i++) {
                createProduct('影音电器', audio[i], true, cate.id);
            }
            for (var i = 0; i < kitchenAppliance.length; i++) {
                createProduct('厨房电器', kitchenAppliance[i], true, cate.id);
            }
        });

        //初始化digital栏目
        var phone = ['苹果', '小米', '三星', '华为', '索尼', '诺基亚', 'HTC', 'LG', '联想', '魅族', '黑莓', '酷派', 'vivo'];
        var camera = ['卡片机', '单反', '微单', '镜头', '胶片相机', '拍立得', '摄像机', 'LOMO相机', '相机配件'];
        var videoGame = ['PS3', 'Wii U', 'Xbox360', 'PSV', '3DSLL', '手柄', '游戏软件', '电玩配件', 'MP3', 'MP4', 'PS4', 'Xbox One'];
        var digitalAccessory = ['移动电源', '保护壳/套', '保护膜', '数据线', '蓝牙耳机', '支架/散热底座', '线控耳机', '上网卡', 'USB周边'];
        var notebook = ['联想', '苹果', '戴尔', '宏基', '惠普', '华硕', '三星', '索尼', '东芝', '神州', '微星', '海尔', '方正', '清华同方'];
        var pad = ['苹果', '三星', '联想', '昂达', '台电', 'Google', '华硕', '微软', '戴尔'];
        var diy = ['CPU', '主板', '显卡', '显示器', '内存', '硬盘', '固态硬盘', '散热器', '电源', '机箱', '键盘', '鼠标'];
        var pc = ['一体机', '品牌机', '服务器', 'DIY兼容机'];

        category.find({
            where: {
                name: '手机数码'
            }
        }).success(function(cate) {
            for (var i = 0; i < phone.length; i++) {
                createProduct('手机', phone[i], true, cate.id);
            }
            for (var i = 0; i < camera.length; i++) {
                createProduct('相机摄像', camera[i], true, cate.id);
            }
            for (var i = 0; i < videoGame.length; i++) {
                createProduct('电玩MP3', videoGame[i], true, cate.id);
            }
            for (var i = 0; i < digitalAccessory.length; i++) {
                createProduct('数码配件', digitalAccessory[i], true, cate.id);
            }
            for (var i = 0; i < notebook.length; i++) {
                createProduct('笔记本', notebook[i], true, cate.id);
            }
            for (var i = 0; i < pad.length; i++) {
                createProduct('平板电脑', pad[i], true, cate.id);
            }
            for (var i = 0; i < diy.length; i++) {
                createProduct('电脑硬件', diy[i], true, cate.id);
            }
            for (var i = 0; i < pc.length; i++) {
                createProduct('台式机', pc[i], true, cate.id);
            }
        });

        //初始化textile栏目
        var bad = ['四件套', '被套', '床垫', '床单', '床罩', '枕头', '床帘', '蚊帐', '颈椎枕'];
        var quilt = ['冬被', '蚕丝被', '羽绒被', '棉被', '羊绒被', '被芯', '空调被', '纤维被'];
        var jiafangyongping = ['拖鞋', '毛巾', '浴巾', '毛毯', '珊瑚绒毯'];
        var jiajushiping = ['摆件', '装饰画', '木雕', '墙贴', '相框', '花瓶', '壁饰', '瓷砖', '石雕', '香薰炉', '果盘', '挂历', '烛台', '风铃', '玉雕', '装饰挂钩'];
        var buyishiping = ['地毯', '沙发垫', '靠垫', '桌布', '椅套', '空调罩', '洗衣机罩', '电视机罩', '十字绣'];
        var curtain = ['珠帘', '卷帘', '门帘', '百叶帘', '线帘', '纱窗', '浴帘', '遮光布'];

        category.find({
            where: {
                name: '家纺'
            }
        }).success(function(cate) {
            for (var i = 0; i < bad.length; i++) {
                createProduct('床品套件', bad[i], true, cate.id);
            }
            for (var i = 0; i < quilt.length; i++) {
                createProduct('被子被芯', quilt[i], true, cate.id);
            }
            for (var i = 0; i < jiafangyongping.length; i++) {
                createProduct('家纺用品', jiafangyongping[i], true, cate.id);
            }
            for (var i = 0; i < jiajushiping.length; i++) {
                createProduct('家具饰品', jiajushiping[i], true, cate.id);
            }
            for (var i = 0; i < buyishiping.length; i++) {
                createProduct('布艺饰品', buyishiping[i], true, cate.id);
            }
            for (var i = 0; i < curtain.length; i++) {
                createProduct('窗帘帘饰', curtain[i], true, cate.id);
            }
        });

        //初始化furniture栏目
        var weiyu = ['马桶', '花洒', '龙头', '面盆', '水槽', '浴霸', '浴缸', '淋浴房', '毛巾架', '置物架', '挂钩', '地漏'];
        var light = ['吸顶灯', '吊灯', '台灯', '护眼灯', '壁灯', '落地灯', '水晶灯', '灯泡', 'LED灯', '节能灯'];
        var furniture = ['瓷砖', '地板', '墙纸', '油漆', '门', '窗', '楼梯', '地暖', '门铃', '报警器', '水管'];
        var wujin = ['锁', '剪刀', '刀', '拉手', '测量工具', '插座', '开关', '接线板', '监控', '门禁', '护栏', '电钻'];
        var zhuoyi = ['床', '婴儿床', '沙发', '衣柜', '电视柜', '床头柜', '书柜', '鞋柜', '斗柜', '角柜', '酒柜', '柜子配件', '餐桌', '餐椅', '书桌', '茶几', '鞋架', '书架', '电脑桌', '电脑椅', '酒吧椅'];

        category.find({
            where: {
                name: '家具'
            }
        }).success(function(cate) {
            for (var i = 0; i < weiyu.length; i++) {
                createProduct('厨卫卫浴', weiyu[i], true, cate.id);
            }
            for (var i = 0; i < light.length; i++) {
                createProduct('灯具照明', light[i], true, cate.id);
            }
            for (var i = 0; i < furniture.length; i++) {
                createProduct('家装建材', furniture[i], true, cate.id);
            }
            for (var i = 0; i < wujin.length; i++) {
                createProduct('五金电工', wujin[i], true, cate.id);
            }
            for (var i = 0; i < zhuoyi.length; i++) {
                createProduct('桌椅床柜', zhuoyi[i], true, cate.id);
            }
        });

        //初始化food栏目
        var food = ['巧克力', '肉松饼', '曲奇', '布丁', '核桃', '腰果', '牛肉干', '猪肉铺', '鸭脖', '糖果', '薯片', '膨化食品', '豆腐干'];
        var baojian = ['维生素', '胶原蛋白', '螺旋藻', '膳食纤维', '氨基酸', '蛋白质粉', '鱼肝油', '蜂胶', '钙镁片'];
        var ginseng = ['人参', '燕窝', '枸杞', '阿胶', '冬虫夏草', '鹿茸', '蜂蜜', '珍珠粉', '灵芝'];
        var tea = ['铁观音', '普洱', '绿茶', '菊花', '玫瑰', '柚子茶', '龙井', '柠檬片', '姜茶', '红茶'];
        var bear = ['国产白酒', '啤酒', '黄酒', '红酒', '洋酒'];
        var seaFood = ['大闸蟹', '海参', '虾', '三文鱼', '香肠', '牛排', '腊肉', '火腿', '火锅', '水果'];
        var noodles = ['方便面', '寿司', '黄油', '大米', '龙须面', '刀削面', '花生油', '橄榄油', '蔬菜', '菇类'];
        var drink = ['奶粉', '牛奶', '酸牛奶', '咖啡', '碳酸饮料', '果汁'];

        category.find({
            where: {
                name: '食品'
            }
        }).success(function(cate) {
            for (var i = 0; i < food.length; i++) {
                createProduct('休闲零食', food[i], true, cate.id);
            }
            for (var i = 0; i < baojian.length; i++) {
                createProduct('营养保健', baojian[i], true, cate.id);
            }
            for (var i = 0; i < ginseng.length; i++) {
                createProduct('参茸滋补', ginseng[i], true, cate.id);
            }
            for (var i = 0; i < tea.length; i++) {
                createProduct('茶叶', tea[i], true, cate.id);
            }
            for (var i = 0; i < bear.length; i++) {
                createProduct('酒类', bear[i], true, cate.id);
            }
            for (var i = 0; i < seaFood.length; i++) {
                createProduct('生鲜蔬果', seaFood[i], true, cate.id);
            }
            for (var i = 0; i < noodles.length; i++) {
                createProduct('粮油米面', noodles[i], true, cate.id);
            }
            for (var i = 0; i < drink.length; i++) {
                createProduct('奶粉饮品', drink[i], true, cate.id);
            }
        });

        //初始化life栏目
        var glass = ['保温杯', '玻璃杯', '运动水壶', '功夫茶具', '酒杯', '咖啡杯', '马桶垫', '沐浴桶', '梳子', '牙刷', '卫生巾', '香薰', '牙膏', '洗衣粉', '油纸', '洗手液', '纸巾', '沐浴露', '漱口水', '洗发露'];
        var clear = ['拖把', '衣架', '垃圾袋', '垃圾桶', '围裙', '马桶刷', '口罩', '袖套', '橡胶手套'];
        var kitechen = ['酱油', '盐', '味精', '调味料', '速食汤', '孜然', '咖喱', '胡椒粉'];
        var outside = ['雨伞', '眼罩', '耳罩', '鞋套', '钥匙扣', '请柬', '储蓄罐', '玩偶', '挂钟'];
        var office = ['钢笔', '圆珠笔', '水笔', '毛笔', '打印纸', '纸', '笔记本', '绘图板', '笔筒', '本子', '胶带', '笔'];

        category.find({
            where: {
                name: '日用百货'
            }
        }).success(function(cate) {
            for (var i = 0; i < glass.length; i++) {
                createProduct('卫浴杯具', glass[i], true, cate.id);
            }
            for (var i = 0; i < clear.length; i++) {
                createProduct('家务清洁', clear[i], true, cate.id);
            }
            for (var i = 0; i < kitechen.length; i++) {
                createProduct('厨房调味', kitechen[i], true, cate.id);
            }
            for (var i = 0; i < outside.length; i++) {
                createProduct('居家创意', outside[i], true, cate.id);
            }
            for (var i = 0; i < office.length; i++) {
                createProduct('办公用品', office[i], true, cate.id);
            }
        });
        cb(null);
    }
]);