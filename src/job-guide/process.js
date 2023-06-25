export const SELECTOR = 'div.job__content__wrapper';

export function crawl(elems) {
  const TABLE_SELECTOR = 'table.job__table tbody > tr:not(.update)';
  const SECTION_MAP = [
    {
      rawTitle: 'Job Actions',
      serializedTitle: 'jobActions',
      serializerFn: serializeActions,
      done: false,
    },
    {
      rawTitle: 'Pet Actions',
      serializedTitle: 'petActions',
      serializerFn: serializeActions,
      done: false,
    },
    {
      rawTitle: 'Role Actions',
      serializedTitle: 'roleActions',
      serializerFn: serializeActions,
      done: false,
    },
    {
      rawTitle: 'Trait',
      serializedTitle: 'traits',
      serializerFn: serializeTraits,
      done: false,
    },
  ];

  return elems.reduce((acc, el, index) => {
    const sectionName = el
      .querySelector('& > h3.job__sub_title')
      ?.innerText.trim();
    const matchingSection = SECTION_MAP.find((_) => _.rawTitle === sectionName);

    // The `done` property prevents executing more than once due to duplicate
    // sections.
    if (matchingSection && !matchingSection.done) {
      const { serializedTitle, serializerFn } = matchingSection;
      acc[serializedTitle] =
        serializerFn(elems[index]?.querySelectorAll(TABLE_SELECTOR)) || [];
      matchingSection.done = true;
    }

    return acc;
  }, {});

  function tableColumnToNumber(td) {
    const normalizedString = td.innerText.match(/(\d*\.?\d+?)/g)?.[0];
    const parseFn = normalizedString?.includes('.') ? parseFloat : parseInt;
    return parseFn(normalizedString) || 0;
  }

  function tableColumnToString(td) {
    return td.innerText.replace(/(job|class) quest/gi, '').trim();
  }

  function serializeActions(actions) {
    return Array.from(actions).map((ac) => {
      const [name, lvl, type, cast, cooldown, cost, , description] =
        ac.querySelectorAll('td');

      const actionImage = name.querySelector('.job__skill_icon img')?.src;

      return {
        name: tableColumnToString(name),
        image: actionImage,
        lvl: tableColumnToNumber(lvl),
        type: tableColumnToString(type),
        cast: tableColumnToNumber(cast),
        cooldown: tableColumnToNumber(cooldown),
        cost: tableColumnToNumber(cost),
        description: tableColumnToString(description),
      };
    });
  }

  function serializeTraits(traits) {
    return Array.from(traits).map((ac) => {
      const [name, lvl, description] = ac.querySelectorAll('td');

      return {
        name: tableColumnToString(name),
        lvl: tableColumnToNumber(lvl),
        description: tableColumnToString(description),
      };
    });
  }
}
