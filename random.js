process.on("message", (cant) => {
    const response = {};
    for (let i = 0; i < cant; i++) {
      const random = parseInt(Math.random() * 1000) + 1;
      if (response.hasOwnProperty(random)) {
        response[random] += 1;
      } else {
        response[random] = 1;
      }
    }
    process.send(response);
  });