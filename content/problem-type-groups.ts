import type { ProblemTypeGroup } from '@/types/content';

export const problemTypeGroups: ProblemTypeGroup[] = [
  { id: 'implementation', title: 'Пряма реалізація та обробка даних', description: 'Симуляція, індекси, порядок дій і базові контейнери.', chapterIds: ['ch-01', 'ch-03', 'ch-05', 'ch-06', 'ch-07', 'ch-12'] },
  { id: 'segments', title: 'Підмасиви, підрядки та відрізки', description: 'Задачі про неперервні частини послідовності.', chapterIds: ['ch-06', 'ch-08', 'ch-10', 'ch-11', 'ch-13', 'ch-17'] },
  { id: 'optimization', title: 'Мінімум, максимум та оптимізація', description: 'Пошук найкращого значення або структури.', chapterIds: ['ch-03', 'ch-10', 'ch-11', 'ch-12', 'ch-16', 'ch-24'] },
  { id: 'construct', title: 'Вибір, розподіл та побудова', description: 'Локальні рішення, призначення та конструктив.', chapterIds: ['ch-12', 'ch-23', 'ch-25', 'ch-26'] },
  { id: 'counting', title: 'Підрахунок кількості способів', description: 'Стани, комбінаторика та правила підрахунку.', chapterIds: ['ch-09', 'ch-16', 'ch-22', 'ch-25'] },
  { id: 'queries', title: 'Багато запитів та зміни даних', description: 'Попередня обробка й структури для швидких відповідей.', chapterIds: ['ch-08', 'ch-11', 'ch-17', 'ch-18'] },
  { id: 'connections', title: 'Зв’язки, маршрути та залежності', description: 'Графові моделі, досяжність і потоки.', chapterIds: ['ch-14', 'ch-15', 'ch-21', 'ch-23'] },
  { id: 'hierarchies', title: 'Ієрархії та дерева', description: 'Кореневі структури, компоненти й запити на деревах.', chapterIds: ['ch-15', 'ch-21'] },
  { id: 'small-parameter', title: 'Малий n або малий параметр', description: 'Експонента стає прийнятною завдяки малому параметру.', chapterIds: ['ch-20', 'ch-25', 'ch-26'] },
  { id: 'numbers', title: 'Числа та математика', description: 'Властивості чисел, формули та комбінаторні моделі.', chapterIds: ['ch-09', 'ch-22', 'ch-25'] },
  { id: 'strings', title: 'Рядки', description: 'Підрядки, збіги, частоти та структура тексту.', chapterIds: ['ch-06', 'ch-08', 'ch-10', 'ch-18'] },
  { id: 'geometry', title: 'Координати та геометрія', description: 'Точки, вектори та просторові відношення.', chapterIds: ['ch-19'] },
  { id: 'hidden', title: 'Алгоритм не видно', description: 'Аналіз обмежень, доведення й переформулювання.', chapterIds: ['ch-02', 'ch-04', 'ch-12', 'ch-26'] },
];
