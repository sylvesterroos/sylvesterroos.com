{
  pkgs,
  ...
}:

{
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_26;
    npm.enable = true;
    lsp.enable = false;
  };
}
