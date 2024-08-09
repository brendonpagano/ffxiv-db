export function processJobAction(action) {
  const effect = {};

  effect.potency = getActionPotency(action);
  effect.combo = getActionCombo(action);
  effect.positional = getActionPositional(action, effect);

  return {
    ...action,
    effect: Object.entries(effect).reduce((acc, [k, v]) => {
      if (!(v === undefined || v === null)) {
        acc[k] = v;
      }

      return acc;
    }, {}),
  };
}

function getActionPotency(action) {
  const match = action.description.match(/potency of (\d+)/)?.[1];
  return parseInt(match, 10) || null;
}

function getActionCombo(action) {
  if (action.type !== 'Weaponskill') {
    return null;
  }

  const comboAction = action.description.match(/Combo Action: (.+)/i);
  const comboPotency = action.description.match(/Combo Potency: (\d+)/i);

  if (!(comboAction || comboPotency)) {
    return null;
  }

  return {
    action: comboAction[1],
    potency: parseInt(comboPotency[1], 10),
  };
}

function getActionPositional(action, effect) {
  if (action.type !== 'Weaponskill') {
    return null;
  }

  const positionalMatch = action.description.match(
    /(\d+) when executed from a target's (\w+)\./i
  );

  if (!positionalMatch) {
    return null;
  }

  return {
    potency: parseInt(positionalMatch[1], 10) - effect.potency,
    area: positionalMatch[2].toLowerCase(),
  };
}
