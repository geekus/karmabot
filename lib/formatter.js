function fmt(literals, ...substitutions) {
  return {
    format: function format(values) {
      const out = [];
      let k = 0;
      for (const lit of literals) {
        const key = substitutions[k];
        k += 1;
        out.push(lit);
        out.push(values[key]);
      }
      return out.join('');
    },
  };
}

module.exports = fmt;
