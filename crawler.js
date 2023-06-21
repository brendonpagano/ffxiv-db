(() => {
  const tableColumnToNumber = (td) => {
    const normalizedString = td.innerText.match(/(\d*\.?\d+?)/g)?.[0];
    const parseFn = normalizedString?.includes(".") ? parseFloat : parseInt;
    return parseFn(normalizedString) || 0;
  };

  const tableColumnToString = (td) =>
    td.innerText.replace(/(job|class) quest/gi, "").trim();

  const jobGuideTables = document.querySelectorAll("table.job__table");

  console.log(
    JSON.stringify(
      {
        jobActions: serializeActions(
          jobGuideTables[0]?.querySelectorAll("tbody > tr:not(.update)")
        ),
        roleActions: serializeActions(
          jobGuideTables[1]?.querySelectorAll("tbody > tr:not(.update)")
        ),
        traits: serializeTraits(
          jobGuideTables[2]?.querySelectorAll("tbody > tr:not(.update)")
        ),
      },
      null,
      2
    )
  );

  function serializeActions(actions) {
    return Array.from(actions).map((ac) => {
      const [name, lvl, type, cast, cooldown, cost, , effect] =
        ac.querySelectorAll("td");

      const actionImage = name.querySelector(".job__skill_icon img")?.src;

      return {
        name: tableColumnToString(name),
        image: actionImage,
        lvl: tableColumnToNumber(lvl),
        type: tableColumnToString(type),
        cast: tableColumnToNumber(cast),
        cooldown: tableColumnToNumber(cooldown),
        cost: tableColumnToNumber(cost),
        effect: tableColumnToString(effect),
      };
    });
  }

  function serializeTraits(traits) {
    return Array.from(traits).map((ac) => {
      const [name, lvl, effect] = ac.querySelectorAll("td");

      return {
        name: tableColumnToString(name),
        lvl: tableColumnToNumber(lvl),
        effect: tableColumnToString(effect),
      };
    });
  }
})();
