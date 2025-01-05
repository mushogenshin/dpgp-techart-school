import { getProductsMapping } from "../../firestore/enrollments";

/** @type {import('commandkit').CommandData}  */
export const data = {
  name: "list",
  description: "Liệt kê các khoá học",
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export const run = async ({ interaction, _client, _handler }) => {
  await interaction.deferReply();

  const productsMapping = await getProductsMapping();
  const productsList = Object.keys(productsMapping).map((code) => {
    return `- **${code}**: ${productsMapping[code]}`;
  });

  interaction.editReply(`Danh mục các sản phẩm:\n${productsList.join("\n")}`);
};

/** @type {import('commandkit').CommandOptions} */
export const options = {
  // https://commandkit.js.org/typedef/CommandOptions
  devOnly: false,
};
