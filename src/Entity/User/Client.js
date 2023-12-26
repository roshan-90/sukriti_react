const Client = {
  create: (name, organisation) => {
    return {
      name: name,
      organisation: organisation,
    };
  },

  getInstance: () => {
    return Client.create("", "");
  },

  getSSF: () => {
    return Client.create("SSF", "Sukriti Social Foundation");
  },
};

export default Client;
