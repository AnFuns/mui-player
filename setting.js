function player(config){
    if(config.url.indexOf(".m3u8")>0||config.url.indexOf(".mp4")>0||config.url.indexOf(".flv")>0){
        MPlayer(config.url,config.title,config.vkey,config.next);
    }else{
        $.ajaxSettings.timeout='30000';
        $.post("json_api.php", {"url":config.url,"time":config.time,"key":config.key,"title":config.title},
            function(data) {
                if(data.code=="200"){
                    MPlayer(data.url,config.title,config.vkey,config.next);
                }else{
                    TheError();
                }
            },'json').error(function (xhr, status, info) {
            TheError();
        });
    }
}
/*播放器初始化*/
function MPlayer(url,title,vkey,nexturl){
    $("#loading").remove();
    $("body").append("<div id=\"mui-player\" class=\"content\"></div>");
    var playerConfig={
        container: '#mui-player', /*播放器ID*/
        themeColor: '#ff6699',   /*进度条颜色*/
        src:url,  /*视频播放地址*/
        title: title,/*视频标题*/
        autoplay: true,/*自动播放*/
        initFullFixed: true,/*是否全屏*/
        preload: 'auto',/*预加载*/
        autoOrientaion: true,/*自动切换方向*/
        dragSpotShape: 'square',/*进度条样式 可选 circula | square*/
        lang: 'zh-cn',/*语言*/
        volume: '1',/*声音默认1 可选0.5*/
        videoAttribute:[
            {attrKey:'webkit-playsinline',attrValue:'webkit-playsinline'},
            {attrKey:'playsinline',attrValue:'playsinline'},
            {attrKey:'x5-video-player-type',attrValue:'h5-page'},
        ],
        plugins: [
            new MuiPlayerDesktopPlugin({
                leaveHiddenControls: true,
                fullScaling: 1,
            }),
            new MuiPlayerMobilePlugin({
                key:'01I01I01H01J01L01K01J01I01K01J01H01D01J01G01E',
                showMenuButton: true,
            })
        ]
    };
    if(url.indexOf("m3u8")>0){
        playerConfig.parse= {
            type:'hls',
            loader:Hls,
            config: {
                debug:false,
            },
        };
    }else if(url.indexOf("flv")>0){
        playerConfig.parse= {
            type:'flv',
            loader:flvjs,
            config: {
                cors:true,
            },
        };
    }
    var mp = new MuiPlayer(playerConfig);
    //记忆播放开始
    mp.on('ready',function(){
        var video = mp.video();
        var currentTime = localStorage.getItem(vkey);
        video.addEventListener("loadedmetadata",function(){
            this.currentTime = currentTime;
        });
        video.addEventListener("timeupdate",function(){
            var currentTime = Math.floor(video.currentTime);
            localStorage.setItem(vkey,currentTime);
        });
        video.addEventListener("ended",function(){
            localStorage.removeItem(vkey);
            if(!!nexturl){
                top.location.href=nexturl;
            }
        });
    //    弹出层提示
    });mp.on('ready',function() {
        //mp.showToast('手机端请手动点击播放');
        mp.showToast('提醒：新年快乐 | AnFuns-Player', 6000)
    });
    mp.on('error',function() {
        mp.showToast('视频加载失败，请刷新一次或提交给站长修复', 5000)
    });
    mp.on('seek-progress',function() {
        mp.showToast('加载中...')
    });
}
function TheError(){
    $("body").append("<div id=\"error\"><h1>解析失败，请稍后再试~</h1></div>");
    $("#loading").remove();
}