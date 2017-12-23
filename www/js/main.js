$(function(){
    var canvas = document.getElementById("mycanvas");
    var ctx,
        myBall,
        myPaddle,
        mouseX,
        score = 0,
        scoreLabel;
    
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
            ctx.font = 'bold 14px "Century Gothic"';
            ctx.fillStyle = "#00AAFF";
            ctx.textAlign = "left";
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
                console.log("game over");
            }
        };
        this.checkCollision = function(paddle){
            if((this.y + this.r > paddle.y && this.y + this.r < paddle.y + paddle.h) &&
            (this.x > paddle.x - paddle.w / 2 && this.x < paddle.x + paddle.w /2)){
                score++;
                this.vy *=-1;
            }
        }
    };
    
    
    //ステージを背景色にしてクリア
    function clearStage(){
        ctx.fillStyle = "#AAEDFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
        
    //Stageのアップデート
    function update(){
        clearStage();
        scoreLabel.draw("SCORE: " + score);
        myPaddle.draw();
        myPaddle.move();
        myBall.draw();
        myBall.move();
        myBall.checkCollision(myPaddle);
        setTimeout(function(){
            update();
        },30);
    }
    
    //パドルの生成
    myPaddle = new Paddle(100, 10);   
    //ボールの生成
    myBall = new Ball(100, 100, 5, 5, 6);
    //scoreのラベルの生成
    scoreLabel = new Label(10, 25);
    scoreLabel.draw("SCORE: " + score);
    
    update();
    
    //マウスのx座標を取得
    $("body").mousemove(function(e){
        mouseX = e.pageX;
    })
});