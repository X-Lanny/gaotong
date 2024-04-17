const PAGE = {
    data: { 
        sectionItemList : ['intro-section', 'onlinecourse-section', 'ourteachers-section', 'dragonboard-section', 'qualcomm-section'],
        navigatorBarFixed: false,
        navigatorBarOffset : 500,
        navigatorBarHeight : 70,
        navigatorBarActiveId: '',
        ourteachersItemWidth: 200,
    },
    init: function(){
        this.bind();
        this.refresh();
    },
    bind: function(){
        let bannerNaviList = document.getElementById('banner-navi-list');
        this.oneventListener(bannerNaviList, 'click','banner-navi-item', this.clickNavigator);
        let onlineTitleIcon = document.getElementById('online-title-icon');
        let onlineCoursesLesson = document.querySelectorAll('.online-courses-lesson');
        onlineCoursesLesson.forEach(courseLesson => {
            PAGE.oneventListener(courseLesson, 'click','online-title-container', PAGE.collapseLessonList);
        })
    },
    refresh: function(){
        window.addEventListener('scroll',this.fixedNavigator);
        window.addEventListener('scroll',this.highlightNavigator);
        let naviOnlinecourse = document.getElementById('navi-onlinecourse')
        naviOnlinecourse.addEventListener('click',this.playVideo);
        let ourteachersArrowL = document.getElementById('ourteachers-arrow-left')
        ourteachersArrowL.addEventListener('click', this.carousel);
        let ourteachersArrowR = document.getElementById('ourteachers-arrow-right')
        ourteachersArrowR.addEventListener('click',this.carousel);
    },
    oneventListener: function(parentNode, action, childClassName, callback){
        parentNode.addEventListener(action, function(e){
            e.target.className.indexOf(childClassName) >= 0 && callback(e);
        })
    },
    //7完成单点轮播图，点击一下切换一位导师
    carousel:function(e){
        let className = e.target.className;
        let ourteachersList = document.getElementById('ourteachers-list');
        let ourteachersArray = document.getElementsByClassName('ourteachers-item');
        // let distance = PAGE.data.ourteachersItemWidth + (ourteachersList.offsetWidth - 4 * PAGE.data.ourteachersItemWidth) / 3;
        if(className === 'ourteachers-arrow left'){
            let firstItem =  ourteachersArray[0];
            let lastItem = ourteachersArray[ourteachersArray.length - 1];
            ourteachersList.appendChild(firstItem);
            // for(i = 0; i< ourteachersArray.length ;i++){            //不用再移动距离了
            //     ourteachersArray[i].style.transform = `translateX(-${distance}px)`;
            // }
        }
        if(className  === 'ourteachers-arrow right'){
            let firstItem =  ourteachersArray[0];
            let lastItem = ourteachersArray[ourteachersArray.length - 1];
            ourteachersList.insertBefore(lastItem, firstItem);
        }
    },
    //6点击课程，页面滚动到视频播放模块，并播放视频
    playVideo: function(){
        let onlineVideo = document.getElementById('online-video');
        onlineVideo.play();
        // 判断哪是不是滚动到视频播放模块；(已删除)
        // let scrollTop = document.documentElement.scrollTop;
        // let offsetTopOnline = document.getElementById('onlinecourse-section').offsetTop;
        // if(scrollTop >= offsetTopOnline + PAGE.data.navigatorBarHeight){
        //     let offsetTopOurTeacher= document.getElementById('ourteachers-section').offsetTop;
        //     if(scrollTop <= offsetTopOurTeacher + PAGE.data.navigatorBarHeight){
        //         // onlineVideo.autoplay = true;
        //     }
        // }
    },
    //5课程列表默认展开，可以点击收起；
    collapseLessonList: function(e){
        let className = e.target.className;
        if( className === 'online-title-container'){
            let courseLesson = e.target.parentNode;
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
        let navigatorPostion = PAGE.data.navigatorBarOffset + PAGE.data.navigatorBarHeight;
        let scrollOrNot = scrollTop >= navigatorPostion;
        if(scrollOrNot !== PAGE.data.navigatorBarFixed){
            PAGE.data.navigatorBarFixed = scrollOrNot;
            let bannerNaviList = document.getElementById('banner-navi-list');
            if(scrollOrNot){
                bannerNaviList.className = 'banner-navi-list fixed'
            }
            else{
                bannerNaviList.className = 'banner-navi-list'
            }
        } 
    },
    // 点击导航，页面滚动到对应模块
    clickNavigator: function(e){    
        let id = e.target.dataset.nav;// intro-section ;
        // let offsetTop = document.getElementsByClassName(id).offsetTop; //为什么classname不行？
        let offsetTop = document.getElementById(id).offsetTop;
        let scrollDistance = offsetTop - PAGE.data.navigatorBarHeight;
        document.documentElement.scrollTop = scrollDistance;
    },
    // 点击课程，页面滚动到某个模块。导航对应模块高亮显示 
    highlightNavigator: function(){
        let scrollTop = document.documentElement.scrollTop;
        let filterNav = PAGE.data.sectionItemList.filter( section => {
            let offsetTop = document.getElementById(section).offsetTop;
            return scrollTop >= offsetTop - PAGE.data.navigatorBarHeight;
        }) 
        let navigatorBarActiveId = filterNav[filterNav.length -1];
        if(navigatorBarActiveId !== PAGE.data.navigatorBarActiveId){
            PAGE.data.navigatorBarActiveId = navigatorBarActiveId;
            let bannerNaviList = document.getElementsByClassName('banner-navi-item');
            for(i = 0; i<bannerNaviList.length; i++ ){
                let dataNav = bannerNaviList[i].dataset.nav;
                if(dataNav === navigatorBarActiveId){
                    bannerNaviList[i].className = 'banner-navi-item active'
                }
                else{
                    bannerNaviList[i].className = 'banner-navi-item'
                }
            }
        }
    },

}
PAGE.init();