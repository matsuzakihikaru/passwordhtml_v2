'use strict';

function onClick(e) {
	let x = e.offsetX;
 	let y = e.offsetY;

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {
 		name_input();
 	}

	//画面4->5 ... 11->12 ->20
 	if (0 <= x && x < imgsize*3 && 0 <= y && y < imgsize*3 && screen%20 >= 4 && screen%20 <= 11) {

 		context.clearRect(0, 0, 1500, 1000);
        let x = e.offsetX;
        let y = e.offsetY;
        let number = Math.floor(y / imgsize) * 3 + Math.floor(x / imgsize) + 1;
        answer.push(number);
        screen++;

		var now_time = new Date();
        times.push(now_time.getTime()-n_time);
        n_time = now_time;

        if (screen%20 <= 11) {
			let hack = new Hack();
			hack.draw();
        }
        else{
			let pass = Math.floor(screen / 20);
			if (pass == 0 || pass == 7) {
				document.getElementById('next').style.visibility = 'visible';
				next();
				return;
			}

     		//screen%20==12
			window.scrollTo(0,0);
			context.clearRect(0, 0, 1500, 1000);

			condition.style.visibility = 'visible';
			condition.value = "";
			document.getElementById('next').style.visibility = 'visible';

			document.getElementById('confidence').style.display = 'inline';

			context.font = "24px sans-serif";
			let sentences = ["推測した条件を入力し、予測の自信度を選択してください。",
				"条件がまったく分からなかった場合には、「不明」などの単語を入力してください。",			
				"次に進むを押すと正解の条件と認証正解数が表示されます。"]

			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 24*i+24);
				}
 		
        }

        return ;
        
 	}

}

//画面更新
function next() {

	//画面更新0->1 ... 3->4
 	if (screen%20 <= 3 & screen<280) {

 		if (screen%20 == 0 & screen/20 == 0) {
 			if (confirm("次の画像パスワード認証に進んでいいですか？　次のパスワードの条件は「前髪で額が隠れている人」です。") == false) {
 				return
 			};
 		}

 		else if (screen%20 == 0 & screen/20 == 7) {
 			if (confirm("次の画像パスワード認証に進んでいいですか？　次のパスワードの条件は「髪がパーマの人」です。") == false) {
 				return
 			};
 		}

 		else if (screen%20 == 0) {
 			if (confirm("次の画像パスワード認証に進んでいいですか？　次のパスワードの条件は自分で推測してください。") == false) {
 				return
 			};
 		}		

 		context.clearRect(0, 0, 1500, 1000);
		let display = new Display();
		display.draw();
 		screen++;

 		document.getElementById('next').style.visibility = 'hidden';

	    window.setTimeout(next, 1800);
		return;
 	}

 	if (screen%20 == 4 & screen<280) {

        n_time = new Date();
 		context.clearRect(0, 0, 1500, 1000);
		let hack = new Hack();
		hack.draw();
		document.getElementById('next').style.visibility = 'hidden';
		return;
 	}

 	if (screen%20 == 12 & screen<280) {
 		let pass = Math.floor(screen / 20);
		if (document.getElementById('confidence').value == 0 && pass!=0 && pass!=7) {
			alert("自信度を選択してください。");
			return
		};

 		if (pass==0 || pass==7 || confirm("推測した条件は「"+condition.value+"」でいいですか？")==true) {
 			let correct = all_data[pass][1].slice(4,12);
 			let point = 0;
 			for (let i=0; i<8; i++) {
 				if (answer[8*pass+i] == correct[i]) {
 					point++;
 				}
 			}

 			condition.style.visibility = 'hidden';
 			screen+=8;

 			confs.push(document.getElementById('confidence').value);

 			document.getElementById('confidence').value=0;
 			document.getElementById('confidence').style.display='none';

 			context.clearRect(0, 0, 1500, 1000);
			context.font = "24px sans-serif";
			let sentences = ["正解の条件 : "+all_data[pass][0],
							"認証正解数 "+point+"/8"]
			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 24*i+24);
				}

			points.push(point);

			if (pass==0 || pass==7) {
				conditions.push("N");
			}
			else{
				conditions.push(condition.value);
			}

 			// return;
 		}

 	if (screen == 280) {

	    var now_time = new Date();
 		all_time=now_time.getTime()-all_start_time;

	    //送信データ
	    var dt = [name.value, points, answer, conditions, rand, rev_rand, times, all_time, confs];
	    var json_data = JSON.stringify(dt);

		fetch("https://script.google.com/macros/s/AKfycbwZWQqmhrgwZYhE-7rNkUPsGShCb8VijSmEFDDUoVd6260UxZOJ-EhilRBXKFCT190b/exec" , {
			method: "POST",
			body: json_data,
			mode: 'no-cors',
			headers: {"Content-Type": "application/json"}
		}).then((dat) => {
	    	console.log(dat);
	  	});;

		context.font = "24px sans-serif";
		let sentences = [
			"これで実験は終了です。お疲れ様でした。",
			"確認コードは、「eraa」になります。ランサーズ上の実験後アンケートに回答してください。",
			"確認コードはこのページを閉じると二度と表示出来なくなるので注意してください。",
			"なお、正解の条件は以下のようになります。"];

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+72);
			}

		for (let i = 0; i < 14; i++) {
			var str;
			if (i == 0) {
				str = "前髪で額が隠れている人";
			}
			else if (i < 7) {
				str = data[rand[i-1]][0];
			}
			else if (i == 7) {
				str = "髪がパーマの人";
			}
			else {
				str = data[rand[i-2]][0];
			}
			context.fillText((i+1)+"セット目の条件："+str+" 認証正解数："+points[i]+"/8", 0, 24*i+72+120);
		}

		document.getElementById('next').style.visibility = 'hidden';		

 	}

 	}
}
	

// 画面番号
let screen = -1;

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.addEventListener('click', onClick, false);
let imgsize = 128;

//認証回答時間
let times = [];
let n_time;

//実験開始時間
var now_time = new Date();
let all_start_time = now_time.getTime();;
//実験総時間
let all_time;

let answer = [];

//実験用データ
let data =[["歯が見えている人", [9, 2, 5, 3, 2, 7, 1, 7, 6, 4, 9, 6]],

	["眼鏡をかけている人", [8, 9, 1, 9, 6, 4, 7, 1, 6, 4, 9, 5]],

	["子供", [5, 5, 8, 2, 3, 6, 6, 8, 3, 3, 6, 8]],

	["帽子をかぶっている人", [4, 7, 4, 3, 4, 4, 7, 8, 1, 9, 6, 3]],

	["ダンディーな人", [8, 9, 9, 2, 6, 1, 3, 2, 6, 5, 5, 7]],

	["背景が緑", [4, 6, 6, 5, 5, 4, 3, 9, 1, 4, 6, 8]],

	//ここから後半

	["モンゴロイドの女性", [2, 1, 5, 1, 9, 4, 2, 7, 3, 9, 5, 8]],

	["金髪の人",[8, 3, 4, 8, 3, 4, 6, 4, 8, 6, 8, 1]],

	["正面を向いていない人", [5, 8, 1, 2, 7, 3, 7, 8, 6, 6, 2, 9]],

	["耳に髪がかかっていない人", [6, 2, 4, 7, 7, 2, 5, 5, 9, 9, 8, 8]],

	["真顔の人", [5, 8, 5, 4, 3, 9, 7, 9, 6, 3, 9, 2]],

	["幼い女の子", [9, 5, 2, 6, 6, 6, 6, 3, 9, 9, 9, 7]]

	];

//練習用データ
let p_data = [
	["前髪で額が隠れている人", [6, 2, 1, 2, 1, 2, 7, 2, 6, 3, 6, 9]],
	["髪がパーマの人", [2, 7, 4, 6, 7, 3, 6, 8, 9, 6, 5, 1]]

	];

//random順番
let rand = [0,1,2,3,4,5,6,7,8,9,10,11];

//randomの逆対応
let rev_rand = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

for(let i = rand.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = rand[i];
    rand[i] = rand[j];
    rand[j] = tmp;
}

for (let i=0; i<rand.length; i++) {
	rev_rand[rand[i]] = i;
}

let all_data = [p_data[0]];

for (let i=0; i<6; i++) {
	all_data.push(data[rand[i]]);
}

all_data.push(p_data[1]);

for (let i=0; i<6; i++) {
	all_data.push(data[rand[i+6]]);
}

//認証時間
let auth_time = [];


//初期画面
context.font = "24px sans-serif";
context.fillText("テキストボックスにあなたのユーザー名を入れ画面をクリックするかEnterキーを押してください。", 0, 36);

document.getElementById('next').style.visibility = 'hidden';
document.getElementById('next').style.display = 'none';

//確信度
document.getElementById('confidence').style.display = 'none';

//実験参加者の名前
let name = document.getElementById("name");

//推測した条件
let condition = document.getElementById("condition");
condition.style.visibility = 'hidden';

let conditions = [];

//point
let points = [];

//自信度
let confs = [];

//初期画面の名前入力
name.addEventListener('keypress', function(e){
	//エンターキーを押す
  	if (e.keyCode === 13) {
		name_input();
	}  
});

//名前入力
function name_input() {

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {

 		if (confirm("あなたのユーザー名は「"+name.value+"」でいいですか？")==false) {
 			return;
 		}

		document.getElementById('name').style.visibility = 'hidden';
		document.getElementById('next').style.display = 'inline';

        var now_time = new Date();
 		all_start_time=now_time.getTime();

		window.scrollTo(0,0);
		context.clearRect(0, 0, 1500, 1000);
		context.font = "24px sans-serif";
		let sentences = [
			"「画像パスワード認証」の画面には9枚の顔画像が並んでいます。（左下図）",
			"9枚の画像の内、ある条件を満たす「画像パスワード」が1枚だけあります。",
			"画像パスワードには一瞬だけ赤い枠が表示されます。これは、操作している人が画像パスワードをクリックしたということです。（右下図）",
			"9枚の画像は4組続けて表示されます。どの組にも、同じ条件を満たす画像パスワードが1枚だけあります。",
			"クリックされた画像を手がかりに、画像パスワードの条件を推測してください。",
			"その後、あなたが推測した条件を使って画像パスワード認証を行ってください。",
			"同じように9枚の顔画像が表示されるので、条件を満たす画像パスワードをクリックしてください。",
			"条件がわからない場合、どれでもいいので1枚の画像をクリックしてください。",
			"ただし、条件が画面に表示されている場合もあります。",
			"その場合は、あなたが推測した条件ではなく、表示されている条件を満たす画像パスワードをクリックしてください。",
			"あなたが操作するときは、9枚の画像が8組表示されます。どの組にも、同じ条件を満たす画像パスワードが1枚だけあります。",
			"その後、あなたが推測した条件と推測の自信度を回答してください。",
			"「条件の推測」と「あなたの操作」を1セットとして、14セットの実験を行います。画像パスワードの条件はセットごとに異なります。",
			"説明を理解したら、画面上部の「次に進む」をクリックして実験を開始してください。"]

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 24*i+24);
			}

			let img = new Image();
	        img.src = "./program/fig1.png";
	        
	        img.onload = function(){
	            context.drawImage(img, 200, 400, imgsize*3, imgsize*3);}

	        let img2 = new Image();
	        img2.src = "./program/fig2.png";
	        
	        img2.onload = function(){
	            context.drawImage(img2, imgsize*3+400, 400, imgsize*3, imgsize*3);}

		document.getElementById('next').style.visibility = 'visible';
 		screen++;
 	}

}

window.onbeforeunload = function(e) {
    e.returnValue = "ページを離れようとしています。よろしいですか？";
}