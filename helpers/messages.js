module.exports = {
  idNotAnObjectId: 'id form is not good',
  emptyFields: 'missing content',
  user: {
    nothing: 'no users available',
    notFound: (id) => `user ${id} not found`,
    created: (id) => `user ${id} created`,
    updated: (id) => `user ${id} updated`,
    deleted: (id) => `user ${id} deleted`,
    emailExisting: 'this address email already existing'
  }
}
