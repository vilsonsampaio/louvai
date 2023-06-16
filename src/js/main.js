const input = `
Deserto
Maria Marçal

Eu não preciso transformar
Pedras em pães para provar
Que no deserto Tu estás
Cuidando de mim

De um lugar alto não vou me lançar
Só pra demonstrar o Teu poder
Eu não preciso ver fenômenos para crer em Ti

Não troco nossa comunhão
Pelo prazer de conquistar
Palácios, riquezas
Como um deserto, isso vai passar

Por isso resistindo estou
E quando a minha força se esgotar
O Teu anjo vai me alimentar

Te adorar é o que sustenta-me de pé
Eu não vou, não vou perder a guerra
Te louvar em meio às tentações
É mais que estratégia

Posso não ver o amanhã
Mas hoje sei
Que esse deserto vai chegar ao fim
O Senhor está cuidando de mim

Eu não preciso transformar
Pedras em pães para provar
Que no deserto Tu estás
Cuidando de mim

De um lugar alto não vou me lançar
Só pra demonstrar o Teu poder
Eu não preciso ver fenômenos para crer em Ti

Não troco nossa comunhão
Pelo prazer de conquistar
Palácios, riquezas
Como um deserto, isso vai passar

Por isso resistindo estou
E quando a minha força se esgotar
O Teu anjo vai me alimentar

E Te adorar é o que sustenta-me de pé
Eu não vou, não vou perder a guerra
Te louvar em meio às tentações
É mais que estratégia

Posso não ver o amanhã
Mas hoje sei
Que esse deserto vai chegar ao fim
O Senhor está cuidando de mim

Te adorar é o que sustenta-me de pé
Eu não vou, não vou perder a guerra
Te louvar em meio às tentações
É mais que estratégia

Posso não ver o amanhã
Mas hoje sei
Que esse deserto vai chegar ao fim
O Senhor está cuidando de mim
`;

const slideWrapper = document.querySelector(".slide-wrapper");
const songCredits = document.querySelector(".song-info");
const LINE_LENGTH = 30;

function reorganizeStanzas(lyric) {
  const cleanedLyric = lyric.split("\n").filter(Boolean);

  const song = cleanedLyric[0];
  const artist = cleanedLyric[1];

  cleanedLyric.shift();
  cleanedLyric.shift();

  let parsedLyrics = "";
  let size = 0;
  let lines = 0;

  cleanedLyric.forEach((verse) => {
    lines += Math.ceil(verse.length / LINE_LENGTH);

    size += verse.length;

    if (size > LINE_LENGTH * 4 || lines > 4) {
      parsedLyrics += "\n";

      lines = Math.ceil(verse.length / LINE_LENGTH);
      size = verse.length;
    }

    parsedLyrics += verse + "\n";
  });

  songCredits.innerText = song + " - " + artist;

  return song + "\n" + artist + "\n\n" + parsedLyrics;
}

function createSlide(id, verses) {
  const slideEl = document.createElement("section");
  const isCover = id === 0;

  slideEl.classList.add("slide");
  slideEl.classList.add(`slide-${String(id).padStart(2, "0")}`);

  if (isCover) {
    slideEl.classList.add("cover");
  }

  slideEl.setAttribute("data-slide", id);

  const slideContainer = document.createElement("div");
  slideContainer.classList.add("container");

  verses.map((verse) => {
    const verseBackground = document.createElement("strong");

    let verseLines = [];
    if (verse.length <= LINE_LENGTH) {
      verseLines.push(verse);
    } else {
      let concatVerse = "";
      const verseWords = verse.split(" ");

      verseWords.forEach((word) => {
        concatVerse += word + " ";

        if (concatVerse.trim().length > LINE_LENGTH) {
          verseLines.push(
            concatVerse.slice(0, concatVerse.trim().length - word.length).trim()
          );

          concatVerse = word + " ";
        }
      });

      if (concatVerse.trim().length) {
        verseLines.push(concatVerse.trim());
      }
    }

    verseLines.forEach((line, index) => {
      const verseEl = document.createElement("span");
      verseEl.innerText = line;

      verseBackground.append(verseEl);
    });

    slideContainer.append(verseBackground);
  });

  slideEl.append(slideContainer);
  slideWrapper.append(slideEl);
}

function goToNextSlide(activeSlide) {
  const slides = document.querySelectorAll(".slide");
  const isActiveSlideTheLastOne = slides[slides.length - 1] === activeSlide;

  if (isActiveSlideTheLastOne) {
    return;
  }

  slides.forEach((slide) => slide.classList.remove("active"));
  const nextSlide = activeSlide.nextElementSibling;

  nextSlide.classList.add("active");

  if (songCredits.classList.contains("hide")) {
    songCredits.classList.remove("hide");
  }
}

function goToPrevSlide(activeSlide) {
  const slides = document.querySelectorAll(".slide");
  const isActiveSlideTheFirstOne = slides[0] === activeSlide;

  if (isActiveSlideTheFirstOne) {
    return;
  }

  slides.forEach((slide) => slide.classList.remove("active"));
  const prevSlide = activeSlide.previousElementSibling;

  if (prevSlide.dataset.slide === "0") {
    songCredits.classList.add("hide");
  }

  prevSlide.classList.add("active");
}

function init() {
  const reorganizedStanzas = reorganizeStanzas(input).split("\n\n");
  reorganizedStanzas.forEach((stanza, index) => {
    createSlide(index, stanza.split("\n").filter(Boolean));
  });

  const firstSlide = document.querySelector("[data-slide='0']");
  firstSlide.classList.add("active");

  songCredits.classList.add("hide");

  window.addEventListener("keydown", (event) => {
    const activeSlide = document.querySelector(".slide.active");

    switch (event.keyCode) {
      case 39:
        goToNextSlide(activeSlide);
        break;

      case 37:
        goToPrevSlide(activeSlide);
        break;
    }
  });
}

init();
