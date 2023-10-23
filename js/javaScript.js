// DOM elementlarni olish
const davlatNomiElement = document.getElementById("davlat-nomi");
const variantlarElement = document.getElementById("variantlar");
const natijaElement = document.getElementById("result");
const keyingiTugma = document.getElementById("keyingi-button");
const vaqtElement = document.getElementById("time");
const togriJavoblarElement = document.getElementById("togri-javoblar");
const imkoniyatlarSoniElement = document.getElementById("imkoniyatlar-soni");
const notogriJavoblarElement = document.getElementById("xato-javoblar");
const qaytaTugma = document.getElementById("qayta-oynash");
const davlatBayrogElement = document.getElementById("davlat-bayrog");
const taymerAudio = new Audio('Timer_voice.wav'); // O'zingiz yaratgan to'vush faylini yuklash

// O'yin holati o'zgaruvchilari
let hozirgiDavlat = {};
let ball = 0;
let togriJavoblar = 0;
let imkoniyatlarSoni = 10;
let notogriJavoblar = 0;
let savollarSoni = 0;
let vaqtQoldi = 15;
let taymerOraligi;

// API yordamida tasodifiy davlatni olish funktsiyasi
async function TasodifiyDavlatniOlish() {
    try {
        const javob = await fetch("https://restcountries.com/v3.1/all");
        const malumot = await javob.json();
        const tasodifiyTanlash = Math.floor(Math.random() * malumot.length);
        shuffleArray(malumot); // Massivni aralashtirish // To'vushni o'ynatish
        return malumot[tasodifiyTanlash];
    } catch (error) {
        console.error('Ma\'lumot olishda xatolik yuz berdi:', error);
    }
}

// Yangi o'yin savolini sozlash funktsiyasi
async function oyinniSozlash() {
    taymerAudio.pause();
    if (savollarSoni === 10) {
        yakuniyXabarniKorsatish();
        keyingiTugma.style.display = "none";
        qaytaTugma.style.display = "block";
        return;
    }

    vaqtniBoshlash();

    hozirgiDavlat = await TasodifiyDavlatniOlish();
    davlatNomiElement.textContent = hozirgiDavlat.name.common;

    // Davlat bayrog'ini chiqarish
    davlatBayrogElement.src = hozirgiDavlat.flags.png;

    const togriJavobIndeksi = Math.floor(Math.random() * 4);

    const variantlar = [hozirgiDavlat.capital[0]];
    for (let i = 0; i < 4; i++) {
        if (i !== togriJavobIndeksi) {
            let tasodifiyDavlat = await TasodifiyDavlatniOlish();
            while (tasodifiyDavlat.capital[0] === hozirgiDavlat.capital[0]) {
                tasodifiyDavlat = await TasodifiyDavlatniOlish();
            }
            if (tasodifiyDavlat.capital[0] == null) {
                alert("error");
            } else {
                variantlar.push(tasodifiyDavlat.capital[0]);
            }
        }
    }

    variantlarElement.innerHTML = "";
    variantlar.forEach((variant) => {
        variantlarElement.innerHTML += `<button class="variant" onclick="javobniTekshir(this)">${variant}</button>`;
    });

    if (variantlar.length === 0) {
        keyingiTugma.style.display = 'block';
        alert('Error');
    }
    natijaElement.textContent = "";
    keyingiTugma.style.display = "none";
    togriJavoblarElement.textContent = `To'g'ri javoblar: ${togriJavoblar}`;
    notogriJavoblarElement.textContent = `Noto'g'ri javoblar: ${notogriJavoblar}`;
}

// Vaqtni boshlash uchun funktsiya
function vaqtniBoshlash() {
    vaqtQoldi = 15;
    vaqtElement.textContent = vaqtQoldi;
    clearInterval(taymerOraligi);
    taymerOraligi = setInterval(() => {
        // console.log(vaqtQoldi);
        vaqtQoldi--;
        vaqtElement.textContent = vaqtQoldi;
        if (vaqtQoldi === 10){
            // To'vushni o'ynatish
            tovushniQaytaBoshlash()
        }
        if (vaqtQoldi > 10) {
            vaqtElement.style.color = 'green';
        } else if (vaqtQoldi > 5) {
            vaqtElement.style.color = 'yellow';
        } else {
            vaqtElement.style.color = 'red';
        }
        if (vaqtQoldi === 0) {
            clearInterval(taymerOraligi);
            javobniTekshir(null);
            taymerAudio.pause();
        }
    }, 1000);
}

// O'yinchining javobini tekshirish funktsiyasi
function javobniTekshir(tanlanganTugma) {
    clearInterval(taymerOraligi);
    const tanlanganVariant = tanlanganTugma ? tanlanganTugma.textContent : null;
    taymerAudio.pause();
    imkoniyatlarSoni -= 1;
    if (tanlanganVariant === hozirgiDavlat.capital[0]) {
        ball += 1;
        togriJavoblar += 1;
        natijaElement.textContent = "To'g'ri! ✅";
    } else {
        notogriJavoblar += 1;
        natijaElement.textContent = "Noto'g'ri! ❌";
    }
    // Barcha tugmalarni o'chirish, to'g'ri/noto'g'ri javoblarni ajratib chiqish va san'atni yangilash
    variantlarElement.querySelectorAll(".variant").forEach((tugma) => {
        if (tugma.textContent === hozirgiDavlat.capital[0]) {
            tugma.style.backgroundColor = "green";
        } else {
            tugma.style.backgroundColor = "red";
        }
        tugma.disabled = true;
    });

    togriJavoblarElement.textContent = `To'g'ri javoblar: ${togriJavoblar}`;
    imkoniyatlarSoniElement.textContent = `Savollar soni : ${savollarSoni + 1}/10 ishlatildi!`;
    notogriJavoblarElement.textContent = `Noto'g'ri javoblar: ${notogriJavoblar}`;
    keyingiTugma.style.display = "block";
}

// Keyingi savolga o'tish funktsiyasi
function keyingiSavol() {

    tovushniQaytaBoshlash(); // Tovushni qayta boshlash // To'vushni o'ynatish

    taymerAudio.pause();
    if (savollarSoni < 10) {
        savollarSoni += 1;
        oyinniSozlash();
    } else {
        yakuniyXabarniKorsatish();
        keyingiTugma.style.display = "none";
        qaytaTugma.style.display = "block";
    }
}

// Tovushni qayta boshlash funktsiyasi
function tovushniQaytaBoshlash() {
    taymerAudio.currentTime = 0; // To'vush faylini boshidan qayta o'ynash uchun
    if(vaqtQoldi == 10){
        taymerAudio.play();
    }
}

// Massivni aralashtirish uchun funktsiya
function shuffleArray(massiv) {
    for (let i = massiv.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [massiv[i], massiv[j]] = [massiv[j], massiv[i]];
    }
}

// O'yin holatini qayta o'rnash funktsiyasi
function oyinHolatiniQaytaOrnatish() {
    ball = 0;
    togriJavoblar = 0;
    notogriJavoblar = 0;
    savollarSoni = 0;
    qaytaTugma.style.display = "none";
    oyinniSozlash();
}

// O'yin tugaguncha xabar berish funktsiyasi
function yakuniyXabarniKorsatish() {
    let xabar;
    if (ball < 3) {
        xabar = "Sizga ko'proq amaliyot kerak! 😒  ";
    } else if (ball < 7) {
        xabar = "Siz juda yaxshi ish qilyapsiz! 😊";
    } else {
        xabar = "Siz kapital mutaxassisisiz! 😁👍";
    }

    natijaElement.textContent = `O'yin tugadi. ${xabar} Siz ${ball} ball to'pladingiz!`;
}

// Qayta o'yin tugmasi uchun hodisa tinglovchi
qaytaTugma.addEventListener("click", oyinHolatiniQaytaOrnatish);

// O'yinni boshlash
oyinniSozlash();
