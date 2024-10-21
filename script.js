import pre_dogs from "./dog-source.mjs";

const generateDogListWithImages = () => {
  // this loop adds random images from an api
  return Promise.all(
    pre_dogs.map(async (dog) => {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await res.json();
      return { ...dog, pic: data.message };
    })
  );
};

const dogTemplate = (dog) => {
  return `
  <div class='dog-item age-${dog.age}'>
  <p>Name: ${dog.name}</p>
  <p>Breed: ${dog.breed}</p>
  <p>Age: ${dog.age}</p>
  <img src="${dog.pic}" alt="${dog.name}" />
  </div>
  `;
};

const generateAgeOptions = (selectElement, dogs) => {
  // this get a sorted list of unique ages from the dogs array
  const ages = [...new Set(dogs.map((dog) => dog.age))].sort((a, b) => a - b);
  ages.forEach((age) => {
    const option = document.createElement("option");
    option.value = age;
    option.classList.add(`age-${age}`);
    option.textContent = age;
    selectElement.appendChild(option);
  });
};

const init = async () => {
  const dogs = await generateDogListWithImages();

  const dogInsertionPoint = document.querySelector(".dog-wrapper");

  const dogHTML = dogs.map(dogTemplate).join("");
  dogInsertionPoint.innerHTML = dogHTML;

  const ageFilter = document.querySelector("#age-filter");

  generateAgeOptions(ageFilter, dogs);

  const handleAgeChange = (event) => {
    const age = event.target.value;
    const matchAges = (dog) => dog.age == age;
    const filteredDogs = dogs.filter(matchAges);
    const filteredHTML = filteredDogs.map(dogTemplate).join("");
    dogInsertionPoint.innerHTML = filteredHTML;
  };

  ageFilter?.addEventListener("change", handleAgeChange);

  const clearButton = document.querySelector("#clear-filter");

  const handleClearFilter = () => {
    ageFilter.value = "";
    dogInsertionPoint.innerHTML = dogHTML;
  };

  clearButton?.addEventListener("click", handleClearFilter);
};

init();
