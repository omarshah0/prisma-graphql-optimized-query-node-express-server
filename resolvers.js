const prisma = require("./prismaClient");

// Get Fields Which Are being Queried
const getFieldNamesFromSelectionSet = (selectionSet) => {
  const fieldNames = [];

  if (selectionSet && selectionSet.selections) {
    for (const selection of selectionSet.selections) {
      if (selection.kind === "Field") {
        fieldNames.push(selection.name.value);
      } else if (selection.kind === "InlineFragment") {
        fieldNames.push(
          ...getFieldNamesFromSelectionSet(selection.selectionSet)
        );
      } else if (selection.kind === "FragmentSpread") {
        // Assuming you handle fragment spreads separately
      }
    }
  }

  return fieldNames;
};

async function getAllEmployees(selectedFields) {
  const employees = await prisma.user.findMany({ select: selectedFields });
  return employees;
}

const resolvers = {
  Query: {
    // Define your Query resolvers here
    hello: () => "Hello, World!",
    users: async (_, __, ___, info) => {
      const fieldNames = getFieldNamesFromSelectionSet(
        info.fieldNodes[0].selectionSet
      );
      const selectedFields = {};
      for (const fieldName of fieldNames) {
        selectedFields[fieldName] = true;
      }
      const users = await getAllEmployees(selectedFields);
      return users;
    },
  },
  Mutation: {
    createUser: (_, { input }) => {
      return {
        id: "123",
        name: input.username,
        email: input.email,
      };
    },
  },
};

module.exports = resolvers;
