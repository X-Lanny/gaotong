const PAGE = {
    data: { 
        sectionItemList : ['intro-section', 'onlinecourse-section', 'ourteachers-section', 'dragonboard-section', 'qualcomm-section'],
        navigatorBarFixed: false,
        navigatorBarOffset : 500,
        navigatorBarHeight : 70,
        navigatorBarActiveId: '',
        ourteachersItemWidth: 200,
        isLock: false,
        index: 0,
        translateX: 0,
        defaultLenght: null,
        duration: 500,
        itemWidth: null,
    },
    init: function(){
        this.bind();
        this.refresh();
        this.clone();
    },
    bind: function(){
        let bannerNaviList = document.getElementById('banner-navi-list');
        this.oneventListener(bannerNaviList, 'click','banner-navi-item', this.clickNavigator);
        let onlineTitleIcon = document.getElementsByClassName('online-title-icon');
        Array.from(onlineTitleIcon).forEach(item => {
            item.addEventListener('click', PAGE.collapseLessonList)
        })

        let swiperPrevArrow = document.getElementById('ourteachers-arrow-left');
        swiperPrevArrow.addEventListener('click', this.swiperPrev);
        let swiperNextArrow = document.getElementById('ourteachers-arrow-right');
        swiperNextArrow.addEventListener('click', this.swiperNext);
    },
    refresh: function(){
        window.addEventListener('scroll',this.fixedNavigator);
        window.addEventListener('scroll',this.highlightNavigator);
        let naviOnlinecourse = document.getElementById('navi-item-1')
        naviOnlinecourse.addEventListener('click',this.playVideo);
    },
    oneventListener: function(parentNode, action, childClassName, callback){
        parentNode.addEventListener(action, function(e){
            e.target.className.indexOf(childClassName) >= 0 && callback(e);
        })
    },
    //7完成单点轮播图，点击一下切换一位导师
    swiperPrev: function(){
        let index = PAGE.data.index;
        PAGE.goIndex(index-1);
    },
    swiperNext: function(){
        let index = PAGE.data.index;
        PAGE.goIndex(index+1);
    },
    //克隆项目，绑定上下滑动事件；
    clone: function(){
        let ourteachersList = document.getElementById('ourteachers-list');
        let swiperItemWidth =  ourteachersList.offsetWidth / 4;
        PAGE.data.itemWidth = swiperItemWidth;

        let ourteachersArray = document.getElementsByClassName('ourteachers-item');
        for(let i = 0; i< ourteachersArray.length; i++){
            ourteachersArray[i].style.width = ourteachersList.offsetWidth /4 + 'px';
        }
        
        let defaultLenght = ourteachersArray.length;
        PAGE.data.defaultLenght = defaultLenght;

        let firstItem =  ourteachersArray[0].cloneNode(true);
        let secondItem =  ourteachersArray[1].cloneNode(true);
        let thirdItem =  ourteachersArray[2].cloneNode(true);
        let lastItem = ourteachersArray[ourteachersArray.length - 1].cloneNode(true);

        let index = PAGE.data.index;
        let translateX = - (swiperItemWidth + index * swiperItemWidth)
        PAGE.data.translateX = translateX;

        ourteachersList.appendChild(firstItem);
        ourteachersList.appendChild(secondItem);
        ourteachersList.appendChild(thirdItem);
        ourteachersList.prepend(lastItem);
        
        PAGE.goIndex(index);
    },
    goIndex: function(index){//index 滑动到第几项
        let ourteachersList = document.getElementById('ourteachers-list');
        let ourteachersArray = document.getElementsByClassName('ourteachers-item');

        let swiperItemWidth = PAGE.data.itemWidth;

        let begintranslateX = PAGE.data.translateX;
        let duration = PAGE.data.duration;
        let endtranslateX = - (swiperItemWidth  + index * swiperItemWidth);
        let isLock = PAGE.data.isLock;
        if(isLock){
            return
        } 
        PAGE.data.isLock = true;
        PAGE.animationTo(begintranslateX , endtranslateX, duration, 
            function(value){
                for(let i = 0;i<ourteachersArray.length;i++){
                    ourteachersArray[i].style.transform = `translateX(${value}px)`;//要加入px
                }
            },
            function(value){
                let defaultLenght = PAGE.data.defaultLenght;
                if(index === -1){
                    index = defaultLenght-1;
                    value = - (swiperItemWidth  + index * swiperItemWidth);
                }
                if(index === defaultLenght){
                    index = 0;
                    value = - (swiperItemWidth  + index * swiperItemWidth);
                }
                for(let i = 0;i<ourteachersArray.length;i++){
                    ourteachersArray[i].style.transform = `translateX(${value}px)`;//要加入px
                }
                PAGE.data.translateX = value;
                PAGE.data.index = index;
                
                PAGE.data.isLock = false;
            });
    },
    animationTo: function(begin, end, duration, changeCallback,finishCallback){
        let startTime = Date.now();
        requestAnimationFrame(function update(){
            let dateNow = Date.now();
            let time = dateNow - startTime;
            let value = PAGE.linear(begin, end ,time,duration);
            // changeCallback
            typeof changeCallback === 'function' && changeCallback(value);
            if(startTime + duration > dateNow){
                requestAnimationFrame(update);
            }
            else{
                typeof finishCallback ==='function' && finishCallback(end);
            }
        })
    },
    linear: function(beginpoint, endpoint, time, duration){
        return (endpoint- beginpoint)*time/duration + beginpoint;
    },
    //6点击课程，页面滚动到视频播放模块，并播放视频
    playVideo: function(){
        let onlineVideo = document.getElementById('online-video');
        onlineVideo.play();
    },
    //5课程列表默认展开，可以点击收起；
    collapseLessonList: function(e){
        let className = e.target.className;
        if( className === 'online-title-icon'){
            let courseLesson = e.target.parentNode.parentNode.parentNode;
            let collapseOrNot = courseLesson.className.indexOf('collapse');

            if(collapseOrNot >= 0){
                courseLesson.className = 'online-courses-lesson';
            }
            else{
                courseLesson.className = 'online-courses-lesson collapse';
            }
        }
    },
    // 页面滚动超过banner高度后，固定位置在顶部
    fixedNavigator: function(){
        let scrollTop = document.documentElement.scrollTop;
        let bannerNaviList = document.getElementById('banner-navi-list');
        let bannerNaviListHeight = bannerNaviList.offsetTop;

        let navigatorPostion = PAGE.data.navigatorBarOffset;

        let scrollOrNot = scrollTop >= navigatorPostion;
        if(scrollOrNot !== PAGE.data.navigatorBarFixed){
            PAGE.data.navigatorBarFixed = scrollOrNot;
            let bannerNaviList = document.getElementById('banner-navi-list');
            if(scrollOrNot){
                bannerNaviList.className = 'banner-navi-list fixed';
                let introSection = document.getElementById('intro-section');
                introSection.className = 'intro-section fixed';
            }
            else{
                bannerNaviList.className = 'banner-navi-list';
                let introSection = document.getElementById('intro-section');
                introSection.className = 'intro-section';
            }
        } 
    },

    // 点击导航，页面滚动到对应模块
    clickNavigator: function(e){    
        let nav = e.target.dataset.nav;// intro-section ;
        let offsetTop = document.getElementById(nav).offsetTop;
        document.documentElement.scrollTop = offsetTop;
    },

    // 页面滚动到某个模块。导航对应模块高亮显示 
    highlightNavigator: function(){
        let scrollTop = document.documentElement.scrollTop;
        let filterNav = PAGE.data.sectionItemList.filter( section => {
            let offsetTop = document.getElementById(section).offsetTop;

            return scrollTop >= offsetTop - PAGE.data.navigatorBarHeight;
        }) 
        let navigatorBarActiveId = filterNav[filterNav.length -1];
        if(navigatorBarActiveId !== PAGE.data.navigatorBarActiveId){
            PAGE.data.navigatorBarActiveId = navigatorBarActiveId;
            PAGE.highlight(navigatorBarActiveId);
        }
    },
    //导航高亮
    highlight:function(navigatorBarActiveId){
            let bannerNaviList = document.getElementsByClassName('banner-navi-item');
            for(i = 0; i<bannerNaviList.length; i++ ){
                let dataNav = bannerNaviList[i].dataset.nav;
                bannerNaviList[i].className = 'banner-navi-item';
                if(dataNav === navigatorBarActiveId){
                    bannerNaviList[i].className = 'banner-navi-item active'
                }
            }
    },
}
PAGE.init();

