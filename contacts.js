const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function readContactsFile() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function writeContactsFile(contacts) {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    throw new Error(+error.message);
  }
}

async function listContacts() {
  try {
    return await readContactsFile();
  } catch (error) {
    throw error;
  }
}

async function getContactById(id) {
  try {
    const contactId = String(id);
    const contacts = await listContacts();
    const result = contacts.find((item) => item.id === contactId);
    return result || null;
  } catch (error) {
    throw error;
  }
}

async function removeContact(id) {
  try {
    const contactId = String(id);
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
      return null;
    }
    const [result] = contacts.splice(index, 1);
    await writeContactsFile(contacts);
    return result;
  } catch (error) {
    throw error;
  }
}

async function addContact(data) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      ...data,
    };
    contacts.push(newContact);
    await writeContactsFile(contacts);
    return newContact;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
