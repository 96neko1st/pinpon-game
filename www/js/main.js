$(function(){
    var canvas = document.getElementById("mycanvas");
    var ctx,
        myBall,
        myPaddle,
        mouseX,
        score = 0,
        scoreLabel,
        isPlaying = false,
        timerId;
    
    if(!canvas || !canvas.getContext) return false;
    ctx = canvas.getContext("2d");
    
    //パドルクラス
    var Paddle = function(w, h){
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.w = w;
        this.h = h;
        this.draw = function(){
          ctx.fillStyle = "#00AAFF";
          ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
        };
        this.move = function(){
            this.x = mouseX - $("#mycanvas").offset().left;
        }
    };
    
    var Label = function(x, y){
        this.x = x;
        this.y = y;
        this.draw = function(text){
            ctx.font = 'bold 64px "Century Gothic"';
            ctx.fillStyle = "#00AAFF";
            ctx.textAlign = "center";
            ctx.fillText(text, this.x, this.y);
        }
    }
    
    
    var Ball = function(x, y, vx, vy, r){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.draw = function(){
            ctx.beginPath();
            ctx.fillStyle = "#FF0088";
            ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, true);
            ctx.fill();
        };
        
        this.move = function(){
            this.x +=this.vx;
            this.y +=this.vy;
            //左端 or 右端
            if(this.x + this.r > canvas.width || this.x - this.r < 0){
                this.vx *=-1; 
            }
            //上
            if(this.y - this.r < 0){
                this.vy *=-1;
            }
            //下
            if(this.y + this.r > canvas.height){
                isPlaying = false;
                $("#btn").text("REPLAY?").fadeIn();
            }
        };
        this.checkCollision = function(paddle){
            if((this.y + this.r > paddle.y && this.y + this.r < paddle.y + paddle.h) &&
            (this.x > paddle.x - paddle.w / 2 && this.x < paddle.x + paddle.w /2)){
                score++;
                if(score % 3 === 0){
                    this.vx *=1.2;
                    paddle.w *=0.8;
                }
                this.vy *=-1;
            }
        }
    };
    
    function rand(min, max){
        return Math.floor(Math.random() * (max - min+1)) + min;
    }
    
    //初期化
    function init(){
        isPlaying = true;
        //パドルの生成
        myPaddle = new Paddle(100, 10);   
        //ボールの生成
        myBall = new Ball(rand(50,250), rand(10, 80), rand(3, 8), rand(3, 8), 6);
        //scoreのラベルの生成
        scoreLabel = new Label(canvas.width/2, canvas.height /2 + 30);
        scoreLabel.draw(score);
    }
    
    //ステージを背景色にしてクリア
    function clearStage(){
        ctx.fillStyle = "#AAEDFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
        
    //Stageのアップデート
    function update(){
        clearStage();
        scoreLabel.draw(score);
        myPaddle.draw();
        myPaddle.move();
        myBall.draw();
        myBall.move();
        myBall.checkCollision(myPaddle);
        timerId = setTimeout(function(){
            update();
        },30);
        if(!isPlaying) clearTimeout(timerId);
    }
    
    $("#btn").click(function(){
        $(this).fadeOut();
        init();
        update();
    })
    
    //マウスのx座標を取得
    $("body").mousemove(function(e){
        mouseX = e.pageX;
    })
});