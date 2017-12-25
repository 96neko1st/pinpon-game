$(function() {
    "use strict";
    
    var canvas = document.getElementById("mycanvas");
    var ctx,
        myBall,
        myPaddle,
        mouseX,
        score,
        scoreLabel,
        isPlaying = false,
        timerId,
        audioReferect,
        img;
        
    if (!canvas || !canvas.getContext) return false;
    ctx = canvas.getContext("2d");
    img = new Image();
    img.src = "./img/f005.png";
    audioReferect = new Audio("./audio/cursor7.mp3");
    
    //パドルクラス
    var Paddle = function(w, h) {
        this.x = canvas.width / 2;
        this.y = canvas.height - 100;
        this.w = w;
        this.h = h;
        this.draw = function() {
            ctx.fillStyle = "#00AAFF";
            ctx.fillRect(this.x - this.w / 2, this.y, this.w, this.h);
        };
        this.move = function() {
            this.x = mouseX - $("#mycanvas")
                .offset()
                .left;
        }
    };
    //スコアクラス
    var Label = function(x, y) {
            this.x = x;
            this.y = y;
            this.draw = function(text) {
                ctx.font = 'bold 256px "Century Gothic"';
                ctx.fillStyle = "#00AAFF";
                ctx.textAlign = "center";
                ctx.fillText(text, this.x, this.y);
            }
        }
        //ボールクラス
    var Ball = function(x, y, vx, vy, r) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.draw = function() {
            ctx.beginPath();
            ctx.fillStyle = "#FF0088";
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
            ctx.fill();
        };
        this.move = function() {
            this.x += this.vx;
            this.y += this.vy;
            //左端 or 右端
            if (this.x + this.r > canvas.width || this.x - this.r < 0) {
                this.vx *= -1;
            }
            //上
            if (this.y - this.r < 0) {
                this.vy *= -1;
            }
            //下
            if (this.y + this.r > canvas.height) {
                isPlaying = false;
                $("#btn")
                    .text("REPLAY")
                    .fadeIn();
            }
        };
        this.checkCollision = function(paddle) {
            if (this.y + this.r > paddle.y && this.y + this.r < paddle.y + paddle.h) {
                if (this.x > paddle.x - paddle.w / 2 && this.x < paddle.x + paddle.w / 2) {
                    audioReferect.play();
                    score++;
                    this.vy *= -1;
                    if (score % 3 === 0) {
                        this.vx *= 1.1;
                        //paddle.w *= 0.9;
                    }
                    if (this.x < paddle.x - paddle.w / 2 * 1 / 3) {
                        if (this.vx > 0) {
                            this.vx *= -1;
                        }
                    } else if (this.x > paddle.x + paddle.w / 2 * 1 / 3) {
                        if (this.vx < 0) {
                            this.vx *= -1;
                        }
                    }
                }
            }
        }
    };
    
    //初期化
    function init() {
        score = 0;
        isPlaying = true;
        //パドルの生成
        myPaddle = new Paddle(250, 30);
        //ボールの生成
        myBall = new Ball(100, 100, 11, 11, 36);
        //scoreのラベルの生成
        scoreLabel = new Label(canvas.width / 2, canvas.height / 2 + 30);
        scoreLabel.draw(score);
    }
    //ステージを背景色にしてクリア
    function clearStage() {
        ctx.fillStyle = "#AAEDFF";
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //ctx.drawImage(img,0,0,canvas.width,canvas.height);
        //ctx.drawImage(img, 0, canvas.height - img.height * 0.8, img.width*0.8, img.height*0.8);
        ctx.globalAlpha = 1;
    }
    //Stageのアップデート
    function update() {
        clearStage();
        scoreLabel.draw(score);
        myPaddle.draw();
        myPaddle.move();
        myBall.draw();
        myBall.move();
        myBall.checkCollision(myPaddle);
        timerId = setTimeout(function() {
            update();
        }, 30);
        if (!isPlaying) clearTimeout(timerId);
    }
    //minからmaxまでの乱数を取得
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //STARTボタン&RESTARTボタンの処理
    $("#btn")
        .click(function() {
            $(this)
                .fadeOut();
            init();
            update();
        })
        //マウスのx座標を取得(Windows用)
    $("body")
        .mousemove(function(e) {
            mouseX = e.pageX;
        });
    //マウスのx座標を取得(スマホ用)
    document.addEventListener("touchmove", function(e) {
        mouseX = e.touches[0].pageX;
    });
});


$(document).ready(function(){
    $("#mycanvas").get(0).width = $(document).width();
    $("#mycanvas").get(0).height = $(document).height() - 10;
})