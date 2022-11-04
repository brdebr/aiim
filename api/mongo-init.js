db.createUser({
  user: 'aiim-admin',
  pwd: 'root-pass',
  roles: [
    {
      role: 'readWrite',
      db: 'aiim-db',
    },
  ],
});
