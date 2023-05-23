## Backend

Fill in the .env file with all the database connection data.

Run the following commands to get the server started:

```bash
$ composer install
```

```bash
$ php artisan migrate
```

```bash
$ php artisan serve
```

The server should now be up and running.

## Client

Fill in the .env file with the server path (there is an example of how you should fill it in)

Run the following commands to get the server started:

```bash
$ npm install
```

```bash
$ npm run start
```

Go to the link in the terminal and the whole app should be up and running.

> **Note:** <br />
> The env file in the clientside folder is not ignored in this todo app because there is no valuable data stored in it