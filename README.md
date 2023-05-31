# db-ray

`db-ray` is an npm package that provides a command-line tool for connecting to your database and viewing its basic table structure and data, making SQL requests, and transforming natural language to SQL using AI.

## Installation

To use db-ray, you need to have Node.js installed on your system. Once you have Node.js installed, you can install the package by running the following command in your terminal:

```bash
npm install -g db-ray
```

This will install the `db-ray` package globally on your system.

## Usage

To use `db-ray`, you can run the following command in your terminal:

```bash
npx db-ray
```

This will launch the `db-ray` command-line tool, and you will be prompted to enter the connection details for your database.

If you don't want to install the package, you can run the following command:

```bash
npx db-ray
```

## Roadmap

- [ ] Decrease the size of the project. It takes quite a long time to be installed. The project uses Next.js as it was the easiest way for me to start. With this approach all frontend dependencies are also installed.
- [ ] Add data edition in the table itself. For now data editing can be done only via requests.
- [ ] Add MySQL support. For now db-ray is tested only with Postgres database.

## Sustaining

`db-ray` is free to use, and I intend to keep it that way. However, I also have costs to cover to maintain and update the tool. Therefore, I'm introducing paid features that can offer additional benefits.

`db-ray` does not send your database data outside of your machine. If you opt for the paid features, only the database schema information is sent via the server at https://db-ray.pro to AI engine. This information is not stored anywhere on the server and is used only to make response more precise.
