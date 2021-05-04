<template>
    <canvas ref="canvas"></canvas>
</template>

<script>
export default {
  props: ['name'],
  // data() {
  //   return {
  //     name: "", //当前用户的用户名
  //   };
  // },
  mounted() {
    generate(this.$refs.canvas, this.name);
  },
  watch: {
    name(value) {
      generate(this.$refs.canvas, value);
    },
  },
  // created() {
  //   this.name = sessionStorage.getItem("userName");
  // },
};

const MULTIPLIER = 1103515245;
const INCREMENT = 12345;
const MODULUS = Math.pow(2, 31);

function lcg(x, i = MULTIPLIER, c = INCREMENT, m = MODULUS) {
  return (i * x + c) % m;
}

function createRandomizer(initialSeed = Date.now()) {
  let seed = initialSeed;
  function reset(newSeed = initialSeed) {
    seed = newSeed;
  }
  function random() {
    seed = lcg(seed);
    return seed / MODULUS;
  }
  function randomInt(min, max) {
    return min + Math.floor(random() * (max - min));
  }
  return {
    reset,
    random,
    randomInt,
  };
}

const randomizer = createRandomizer();

function proceduralDraw(cx, randomizer, start, draw) {
  const total = randomizer.randomInt(4, 10);
  const radius = cx.canvas.width >> randomizer.randomInt(1, 3);
  for (let index = 0; index < total; index++) {
    const angle = start + (index / total) * Math.PI * 2;
    draw(cx, { index, total, angle, radius });
  }
}

function generate(canvas, name) {
  const cx = canvas.getContext("2d");
  if (cx.canvas.width !== cx.canvas.clientWidth) {
    cx.canvas.width = cx.canvas.clientWidth;
  }

  if (cx.canvas.height !== cx.canvas.clientHeight) {
    cx.canvas.height = cx.canvas.clientHeight;
  }

  const ccx = cx.canvas.width >> 1;
  const ccy = cx.canvas.height >> 1;
  const min = cx.canvas.width >> 6;
  const max = cx.canvas.width >> 2;

  const start = randomizer.random() * Math.PI;

  cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height);
  let vowels = 0,
    consonants = 0,
    numbers = 0,
    symbols = 0,
    sum = 0,
    seed = 0;

  for (let index = 0; index < name.length; index++) {
    const char = name.charAt(index);
    const charCode = name.charCodeAt(index);
    if (char.match(/[0-9]/)) {
      numbers++;
    } else if (char.match(/[aeiouáéíóúàèìòùäëïöüâêîôû]/)) {
      vowels++;
    } else if (char.match(/[_\-@"'#$%&\/()=¿?¡!<>{}\[\]ºª\\'`+]/)) {
      symbols++;
    } else {
      consonants++;
    }
    sum += charCode;
  }
  seed = sum >>> (numbers * vowels * symbols * consonants);
  randomizer.reset(seed);
  // randomizer.random()
  const hue = randomizer.randomInt(0, 360);
  cx.fillStyle = `hsl(${hue}, 50%, 50%)`;
  cx.fillRect(0, 0, cx.canvas.width, cx.canvas.height);

  proceduralDraw(
    cx,
    randomizer,
    start,
    (cx, { index, total, angle, radius }) => {
      const acx = ccx + Math.cos(angle) * radius;
      const acy = ccy + Math.sin(angle) * radius;
      cx.beginPath();
      cx.arc(acx, acy, cx.canvas.width >> 3, 0, Math.PI * 2);
      cx.closePath();
      cx.fillStyle = `hsl(${hue}, 50%, 75%)`;
      cx.fill();
    }
  );

  cx.beginPath();
  proceduralDraw(
    cx,
    randomizer,
    start,
    (cx, { index, total, angle, radius }) => {
      const acx = ccx + Math.cos(angle) * radius;
      const acy = ccy + Math.sin(angle) * radius;
      if (index === 0) {
        cx.moveTo(acx, acy);
      } else {
        cx.lineTo(acx, acy);
      }
    }
  );
  cx.closePath();
  cx.lineWidth = randomizer.randomInt(min, max);
  cx.strokeStyle = `hsl(${hue}, 50%, 25%)`;
  cx.stroke();

  cx.beginPath();
  proceduralDraw(
    cx,
    randomizer,
    start,
    (cx, { index, total, angle, radius }) => {
      const acx = ccx + Math.cos(angle) * radius;
      const acy = ccy + Math.sin(angle) * radius;
      if (index === 0) {
        cx.moveTo(acx, acy);
      } else {
        cx.lineTo(acx, acy);
      }
    }
  );
  cx.closePath();
  cx.lineWidth = randomizer.randomInt(min, max);
  cx.strokeStyle = `hsl(${hue}, 50%, 60%)`;
  cx.stroke();

  cx.beginPath();
  cx.arc(ccx, ccy, randomizer.randomInt(min, max), 0, Math.PI * 2);
  cx.closePath();
  cx.fillStyle = `hsl(${hue}, 50%, ${randomizer.randomInt(30, 70)}%)`;
  cx.fill();
}
</script>

<style>
canvas {
  width: 3rem;
  height: 3rem;
}
</style>
