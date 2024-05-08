'use strict';

function onClick(e) {
	let x = e.offsetX;
 	let y = e.offsetY;

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {
 		name_input();
 	}

	//画面0->1 ... 4->5 ... 11->12 ->20
 	if (0 <= x && x < imgsize*3 && 0 <= y && y < imgsize*3 && screen%20 >=1 && screen%20 <= 12) {

 		context.clearRect(0, 0, 1500, 1000);
        let x = e.offsetX;
        let y = e.offsetY;
        let number = Math.floor(y / imgsize) * 3 + Math.floor(x / imgsize);

        answer.push(number);

		var now_time = new Date();
        times.push(now_time.getTime()-n_time);
        n_time = now_time;


        if (screen%20 <= 11) {

			let hack = new Hack();
			hack.draw();
			screen++;
        }
        else{

        	screen++;

			let pass = Math.floor(screen / 20);

     		//screen%20==13
			window.scrollTo(0,0);
			context.clearRect(0, 0, 1500, 1000);

			condition.style.visibility = 'visible';
			condition.value = "";
			document.getElementById('next').style.visibility = 'visible';

			context.font = "48px sans-serif";
			let sentences = ["推測した条件を入力してください",
				"条件がまったく分からなかった場合には",
				"「不明」などの単語を入力してください。",			
				"次に進むを押すと正解の条件が表示されます。"]

			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 48*i+48);
				}
        }

        return ;
        
 	}

}

//画面更新
function next() {

	//画面更新0->1
 	if (screen%20 == 0 & screen<80) {
 		alert("正規認証者が操作してください")
 		context.clearRect(0, 0, 1500, 1000);
 		document.getElementById('next').style.visibility = 'hidden';

		var now_time = new Date();
        times.push(String(now_time.getTime()-n_time));
        n_time = now_time;

		let hack = new Hack();
		hack.draw();

        screen++;

		return;
 	}

 	if (screen%20 == 13 & screen<80) {
 		let pass = Math.floor(screen / 20);

 		if (confirm("推測した条件は「"+condition.value+"」でいいですか？")==true) {
 			let correct = all_data[pass][1].slice(4,12);
 			let point = 0;
 			for (let i=0; i<8; i++) {
 				if (answer[12*pass+i+4] == correct[i]) {
 					point++;
 				}
 			}

 			let auth_correct = all_data[pass][1].slice(0,4);
 			let auth_point = 0;
 			for (let i=0; i<4; i++) {
 				if (answer[12*pass+i] == auth_correct[i]) {
 					auth_point++;
 				}
 			}

 			condition.style.visibility = 'hidden';
 			screen+=7;

 			context.clearRect(0, 0, 1500, 1000);
			context.font = "48px sans-serif";
			let sentences = ["正解の条件 : "+all_data[pass][0],
							"認証正解数(非正規) "+point+"/8",
							"認証正解数(正規) "+auth_point+"/4"]
			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 48*i+48);
				}

			points.push(point);
			auth_points.push(auth_point);
			conditions.push(condition.value);

 		}

 	if (screen == 80) {

		console.log("finished");

	    var now_time = new Date();
 		all_time=now_time.getTime()-all_start_time;

	    //送信データ
	    var dt = [name.value,age.value, gender.value,auth_points, points, answer, conditions, rand, times, all_time];
	    var json_data = JSON.stringify(dt);

		fetch("https://script.google.com/macros/s/AKfycbxDy-__0qBbn8FT1DopARGtoFxq1fkpqPLytN_O9DTD3SY3XPS1ZA-4lI9bCVXEW8cifA/exec" , {
			method: "POST",
			body: json_data,
			mode: 'no-cors',
			headers: {"Content-Type": "application/json"}
		}).then((dat) => {
	    	console.log(dat);
	  	});;

		context.font = "48px sans-serif";
		let sentences = [
			"これで実験は終了です。お疲れ様でした。"];

			for (let i = 0; i < sentences.length; i++) {
				context.fillText(sentences[i], 0, 48*i+48*4);
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
let imgsize = 256;

//認証回答時間
let times = ["N"];


//実験開始時間
var now_time = new Date();
let n_time = now_time;
let all_start_time = now_time.getTime();;
//実験総時間
let all_time;

let answer = [];

//実験用データ
let data =[["真っ直ぐ下向きの図形", [2, 3, 0, 5, 2, 5, 4, 4, 5, 5, 0, 6]],

	["最も緑色の図形", [7, 7, 7, 1, 7, 6, 6, 0, 4, 6, 2, 2]],

	["三角形に近い図形", [7, 1, 5, 4, 6, 6, 3, 0, 6, 8, 3, 8]],

	["重なりが1枚の図形", [1, 1, 4, 3, 1, 8, 1, 0, 6, 4, 2, 8]]

	];

//random順番
let rand = [0,1,2,3];

//randomの逆対応
let rev_rand = [-1,-1,-1,-1];

for(let i = rand.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = rand[i];
    rand[i] = rand[j];
    rand[j] = tmp;
}

for (let i=0; i<rand.length; i++) {
	rev_rand[rand[i]] = i;
}

let all_data = [];

for (let i=0; i<4; i++) {
	all_data.push(data[rand[i]]);
}

//認証時間
let auth_time = [];


//初期画面
context.font = "48px sans-serif";
context.fillText("非正規認証者の情報を入れ画面をタップしてください。", 0, 24*2);

document.getElementById('next').style.visibility = 'hidden';
document.getElementById('next').style.display = 'none';

//非正規認証者の属性
let name = document.getElementById("name");
let gender = document.getElementById("gender");
let age = document.getElementById("age");

//推測した条件
let condition = document.getElementById("condition");
condition.style.visibility = 'hidden';

let conditions = [];

//非正規認証者 point
let points = [];

// 正規認証者 point
let auth_points = [];

//名前入力
function name_input() {

	//画面更新-1->0
 	if (screen == -1 && name.value.length>0) {

 		if (name.value == "") {
 			alert("名前を入力してください");
 			return;
 		}
 		if (age.value == "") {
 			alert("年齢を入力してください");
 			return;
 		}
 		if (gender.value == 0) {
 			alert("性別を選択してください");
 			return;
 		}

 		if (confirm("非正規認証者の属性を全て入力しましたか？")==false) {
 			return;
 		}

		document.getElementById('name').style.visibility = 'hidden';
		document.getElementById('gender').style.visibility = 'hidden';
		document.getElementById('age').style.visibility = 'hidden';
		document.getElementById('next').style.display = 'inline';

        var now_time = new Date();
 		all_start_time=now_time.getTime();

		window.scrollTo(0,0);
		context.clearRect(0, 0, 1500, 1000);
		context.font = "48px sans-serif";
		let sentences = [
			"正規認証者役の人は実験説明をしてください",
			"非正規認証者役の人が実験を理解したら次へ進むを押してください"]

		for (let i = 0; i < sentences.length; i++) {
			context.fillText(sentences[i], 0, 48*i+48);
			}

		document.getElementById('next').style.visibility = 'visible';
 		screen++;
 	}

}

window.onbeforeunload = function(e) {
    e.returnValue = "ページを離れようとしています。よろしいですか？";
}