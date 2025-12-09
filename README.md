tree-sitter-symon
=================

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

This is a [tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for the specification language of [SyMon](https://github.com/MasWag/SyMon).

Installation
------------

You can install tree-sitter-symon in several ways depending on your platform and preferences.

### Homebrew (macOS/Linux with Homebrew)

```
brew install --HEAD maswag/scientific/tree-sitter-symon
```

This will install the grammar library to the standard Homebrew prefix (e.g., `/opt/homebrew/include/tree_sitter/`).

### Arch Linux

You can install it using a provided PKGBUILD. First, fetch the build script:

```
mkdir tree-sitter-symon && cd tree-sitter-symon
wget https://gist.githubusercontent.com/MasWag/e438cb65fc4bf880307e7b7823592a2d/raw/0690c387ff49c8da7a9bd7782ca0a92d076d8d50/PKGBUILD
makepkg -is
```

### Build from source

Clone the repository and build manually using cmake:

```
git clone https://github.com/MasWag/tree-sitter-symon.git
cd tree-sitter-symon
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
cmake --build build
sudo cmake --install build
```

By default, the headers and parser will be installed under `/usr/local/include/tree_sitter/` and `/usr/local/lib/`.

License
-------

This project is licensed under the Apache 2.0 License.

Development notes
-----------------

`src/` is generated code. When making grammar changes, edit `grammar.js` and then regenerate the parser (for example with `npx tree-sitter generate`). Please do not modify files under `src/` directly because those edits will be overwritten the next time the parser is generated.
