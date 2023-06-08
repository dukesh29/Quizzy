import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Category from './models/Category';
import Quiz from './models/Quiz';
import Question from './models/Question';

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('categories');
    await db.dropCollection('quizzes');
    await db.dropCollection('questions');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  const [admin, user, user2] = await User.create(
    {
      email: 'admin@admin.com',
      password: 'admin',
      isActivated: true,
      role: 'admin',
      displayName: 'John Wick',
      avatar: '/fixtures/johnwick.jpeg',
      googleId: null,
      facebookID: null,
    },
    {
      email: 'user@user.com',
      password: 'user',
      isActivated: true,
      role: 'user',
      displayName: 'Lara Croft',
      avatar: '/fixtures/laracroft.jpg',
      googleId: null,
      facebookID: null,
    },
    {
      email: 'tony@gmail.com',
      password: '12345',
      isActivated: true,
      role: 'user',
      displayName: 'Tony Stark',
      avatar: '/fixtures/tonystark.jpeg',
      googleId: null,
      facebookID: null,
    },
  );

  const categories = await Category.create(
    { name: 'История' },
    { name: 'География' },
    { name: 'Литература' },
    { name: 'Искусство' },
    { name: 'Музыка' },
    { name: 'Фильмы' },
    { name: 'Наука' },
    { name: 'Спорт' },
    { name: 'Еда и напитки' },
    { name: 'Путешествия' },
    { name: 'Технологии' },
    { name: 'Мода' },
    { name: 'Здоровье и фитнес' },
    { name: 'Психология' },
    { name: 'Животные' },
    { name: 'Природа' },
    { name: 'Автомобили' },
    { name: 'Бизнес и финансы' },
    { name: 'Президенты' },
    { name: 'Религия' },
  );

  const [marvel, soccer, hiphop, cars] = await Quiz.create(
    {
      category: categories[5]._id,
      author: admin._id,
      title: 'Кто сыграл в Марвел?',
      picture: '/fixtures/marvel.jpeg',
    },
    {
      category: categories[7]._id,
      author: user._id,
      title: 'Великие футболисты',
      picture: '/fixtures/soccer.jpeg',
    },
    {
      category: categories[4]._id,
      author: user._id,
      title: 'Великие хип-хоп исполнители',
      picture: '/fixtures/hiphop.jpeg',
    },
    {
      category: categories[16]._id,
      author: user2._id,
      title: 'Гонщики Формулы-1',
      picture: '/fixtures/formula1.jpg',
    },
  );

  await Question.create(
    {
      quiz: marvel._id,
      text: 'Какой актер сыграл роль Железного человека (Тони Старка) в фильмах Марвел?',
      options: [
        { variant: 'Роберт Дауни Мл.', isCorrect: true },
        { variant: 'Крис Эванс', isCorrect: false },
        { variant: 'Крис Хемсворт', isCorrect: false },
        { variant: 'Марк Руффало', isCorrect: false },
      ],
    },
    {
      quiz: marvel._id,
      text: 'Какой актер сыграл роль Капитана Америки (Стивена Роджерса) в фильмах Марвел?',
      options: [
        { variant: 'Крис Эванс', isCorrect: true },
        { variant: 'Роберт Дауни Мл.', isCorrect: false },
        { variant: 'Крис Хемсворт', isCorrect: false },
        { variant: 'Марк Руффало', isCorrect: false },
      ],
    },
    {
      quiz: marvel._id,
      text: 'Кто сыграл роль Тора в фильмах Марвел?',
      options: [
        { variant: 'Крис Хемсворт', isCorrect: true },
        { variant: 'Роберт Дауни Мл.', isCorrect: false },
        { variant: 'Крис Эванс', isCorrect: false },
        { variant: 'Марк Руффало', isCorrect: false },
      ],
    },
    {
      quiz: marvel._id,
      text: 'Какой актер сыграл роль Халка (Брюса Бэннера) в фильмах Марвел?',
      options: [
        { variant: 'Марк Руффало', isCorrect: true },
        { variant: 'Роберт Дауни Мл.', isCorrect: false },
        { variant: 'Крис Эванс', isCorrect: false },
        { variant: 'Крис Хемсворт', isCorrect: false },
      ],
    },
    {
      quiz: marvel._id,
      text: 'Кто сыграл роль Черной Вдовы (Наташи Романофф) в фильмах Марвел?',
      options: [
        { variant: 'Скарлетт Йоханссон', isCorrect: true },
        { variant: 'Зои Салдана', isCorrect: false },
        { variant: 'Эмили Блант', isCorrect: false },
        { variant: 'Бри Ларсон', isCorrect: false },
      ],
    },
    {
      quiz: marvel._id,
      text: 'Какой актер сыграл роль Человека-паука (Питера Паркера) в фильмах Марвел?',
      options: [
        { variant: 'Том Холланд', isCorrect: true },
        { variant: 'Андрю Гарфилд', isCorrect: false },
        { variant: 'Тоби Магуайр', isCorrect: false },
        { variant: 'Бенедикт Камбербэтч', isCorrect: false },
      ],
    },
    {
      quiz: marvel._id,
      text: 'Кто сыграл роль Таноса в фильмах Марвел?',
      options: [
        { variant: 'Джош Бролин', isCorrect: true },
        { variant: 'Том Хиддлстон', isCorrect: false },
        { variant: 'Крис Пратт', isCorrect: false },
        { variant: 'Пол Беттани', isCorrect: false },
      ],
    },
    {
      quiz: marvel._id,
      text: 'Какой актер сыграл роль Доктора Стрэнджа в фильмах Марвел?',
      options: [
        { variant: 'Бенедикт Камбербэтч', isCorrect: true },
        { variant: 'Роберт Дауни Мл.', isCorrect: false },
        { variant: 'Крис Хемсворт', isCorrect: false },
        { variant: 'Крис Эванс', isCorrect: false },
      ],
    },
    {
      quiz: soccer._id,
      text: 'Какой футболист является рекордсменом по количеству забитых голов в карьере?',
      options: [
        { variant: 'Лионель Месси', isCorrect: false },
        { variant: 'Криштиану Роналду', isCorrect: false },
        { variant: 'Пеле', isCorrect: false },
        { variant: 'Хосеф Бикан', isCorrect: true },
      ],
    },
    {
      quiz: soccer._id,
      text: 'Кто из перечисленных футболистов выиграл Золотой мяч в 2020 году?',
      options: [
        { variant: 'Лионель Месси', isCorrect: false },
        { variant: 'Криштиану Роналду', isCorrect: false },
        { variant: 'Роберт Левандовски', isCorrect: true },
        { variant: 'Неймар', isCorrect: false },
      ],
    },
    {
      quiz: soccer._id,
      text: 'В каком клубе играл футболист Лионель Месси до 2021 года?',
      options: [
        { variant: 'Реал Мадрид', isCorrect: false },
        { variant: 'Манчестер Юнайтед', isCorrect: false },
        { variant: 'Барселона', isCorrect: true },
        { variant: 'Бавария', isCorrect: false },
      ],
    },
    {
      quiz: soccer._id,
      text: 'Кто из перечисленных футболистов получил прозвище "Король Футбола"?',
      options: [
        { variant: 'Лионель Месси', isCorrect: false },
        { variant: 'Диего Марадона', isCorrect: true },
        { variant: 'Криштиану Роналду', isCorrect: false },
        { variant: 'Пеле', isCorrect: false },
      ],
    },
    {
      quiz: soccer._id,
      text: 'Какой футболист стал обладателем Золотого мяча наибольшее количество раз?',
      options: [
        { variant: 'Лионель Месси', isCorrect: true },
        { variant: 'Криштиану Роналду', isCorrect: false },
        { variant: 'Мишель Платини', isCorrect: false },
        { variant: 'Йохан Кройф', isCorrect: false },
      ],
    },
    {
      quiz: soccer._id,
      text: 'Кто является рекордсменом по количеству выигранных Лиг Чемпионов?',
      options: [
        { variant: 'Криштиану Роналду', isCorrect: false },
        { variant: 'Лионель Месси', isCorrect: false },
        { variant: 'Икер Касильяс', isCorrect: false },
        { variant: 'Франческо Тотти', isCorrect: true },
      ],
    },
    {
      quiz: soccer._id,
      text: 'Кто из перечисленных футболистов является рекордсменом сборной Бразилии по количеству забитых голов?',
      options: [
        { variant: 'Роналдо', isCorrect: false },
        { variant: 'Пеле', isCorrect: true },
        { variant: 'Ривалдо', isCorrect: false },
        { variant: 'Ромарио', isCorrect: false },
      ],
    },
    {
      quiz: soccer._id,
      text: 'Какой футболист получил прозвище "Черный жемчуг"?',
      options: [
        { variant: 'Эусебио', isCorrect: true },
        { variant: 'Роберто Баджо', isCorrect: false },
        { variant: 'Диего Марадона', isCorrect: false },
        { variant: 'Роналдо', isCorrect: false },
      ],
    },
    {
      quiz: hiphop._id,
      text: 'Какой хип-хоп исполнитель выпустил альбом "The Marshall Mathers LP"?',
      options: [
        { variant: 'Jay-Z', isCorrect: false },
        { variant: 'Kanye West', isCorrect: false },
        { variant: 'Eminem', isCorrect: true },
        { variant: 'Drake', isCorrect: false },
      ],
    },
    {
      quiz: hiphop._id,
      text: 'Какой хип-хоп дуэт исполнил песню "California Love"?',
      options: [
        { variant: 'Outkast', isCorrect: false },
        { variant: 'Mobb Deep', isCorrect: false },
        { variant: 'Wu-Tang Clan', isCorrect: false },
        { variant: '2Pac & Dr. Dre', isCorrect: true },
      ],
    },
    {
      quiz: hiphop._id,
      text: 'Кто из перечисленных артистов является основателем лейбла Roc-A-Fella Records?',
      options: [
        { variant: '50 Cent', isCorrect: false },
        { variant: 'Snoop Dogg', isCorrect: false },
        { variant: 'Nas', isCorrect: false },
        { variant: 'Jay-Z', isCorrect: true },
      ],
    },
    {
      quiz: hiphop._id,
      text: 'Какой хип-хоп исполнитель выиграл премию Grammy в категории "Лучший рэп-альбом" самое большое количество раз?',
      options: [
        { variant: 'Kendrick Lamar', isCorrect: false },
        { variant: 'Eminem', isCorrect: true },
        { variant: 'J. Cole', isCorrect: false },
        { variant: 'Lil Wayne', isCorrect: false },
      ],
    },
    {
      quiz: hiphop._id,
      text: 'Кто из перечисленных хип-хоп исполнителей выпустил альбом "The Blueprint"?',
      options: [
        { variant: 'Nas', isCorrect: false },
        { variant: 'Kanye West', isCorrect: false },
        { variant: 'Jay-Z', isCorrect: true },
        { variant: 'Dr. Dre', isCorrect: false },
      ],
    },
    {
      quiz: cars._id,
      text: 'Кто является самым успешным гонщиком в истории Формулы-1?',
      options: [
        { variant: 'Michael Schumacher', isCorrect: true },
        { variant: 'Lewis Hamilton', isCorrect: false },
        { variant: 'Ayrton Senna', isCorrect: false },
        { variant: 'Sebastian Vettel', isCorrect: false },
      ],
    },
    {
      quiz: cars._id,
      text: 'Какой гонщик выиграл наибольшее количество чемпионских титулов в Формуле-1?',
      options: [
        { variant: 'Juan Manuel Fangio', isCorrect: false },
        { variant: 'Michael Schumacher', isCorrect: true },
        { variant: 'Lewis Hamilton', isCorrect: false },
        { variant: 'Ayrton Senna', isCorrect: false },
      ],
    },
    {
      quiz: cars._id,
      text: 'Кто из перечисленных гонщиков выиграл чемпионат Формулы-1 в 2019 году?',
      options: [
        { variant: 'Sebastian Vettel', isCorrect: false },
        { variant: 'Max Verstappen', isCorrect: false },
        { variant: 'Valtteri Bottas', isCorrect: false },
        { variant: 'Lewis Hamilton', isCorrect: true },
      ],
    },
    {
      quiz: cars._id,
      text: 'Кто является самым молодым чемпионом мира в истории Формулы-1?',
      options: [
        { variant: 'Sebastian Vettel', isCorrect: true },
        { variant: 'Fernando Alonso', isCorrect: false },
        { variant: 'Lewis Hamilton', isCorrect: false },
        { variant: 'Michael Schumacher', isCorrect: false },
      ],
    },
    {
      quiz: cars._id,
      text: 'Какой гонщик выиграл больше всего Гран-при Формулы-1?',
      options: [
        { variant: 'Michael Schumacher', isCorrect: true },
        { variant: 'Lewis Hamilton', isCorrect: false },
        { variant: 'Ayrton Senna', isCorrect: false },
        { variant: 'Sebastian Vettel', isCorrect: false },
      ],
    },
    {
      quiz: cars._id,
      text: 'Какой гонщик выиграл чемпионат Формулы-1 наибольшее количество раз подряд?',
      options: [
        { variant: 'Michael Schumacher', isCorrect: false },
        { variant: 'Lewis Hamilton', isCorrect: false },
        { variant: 'Sebastian Vettel', isCorrect: true },
        { variant: 'Ayrton Senna', isCorrect: false },
      ],
    },
  );

  await db.close();
};

void run();
