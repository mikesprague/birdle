FROM mcr.microsoft.com/devcontainers/typescript-node:dev-24-bookworm

# install some common utils
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends \
  apt-transport-https lsb-release ca-certificates \
  software-properties-common gnupg gnupg2 curl wget zip unzip jq nano vim \
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /var/tmp/* /tmp/* \
  && rm -rf /var/cache/apt/archives/*

# update npm and install some packages globally
RUN npm install --location=global npm \
  conventional-changelog \
  cross-env \
  cz-git \
  hunkdiff \
  npm-check-updates \
  oxfmt \
  oxlint \
  rimraf \
  && npm cache clean --force \
  && rm -rf /var/tmp/* /tmp/*

# setup bash history
ARG USERNAME=node
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/command-history/.bash_history" \
  && mkdir /command-history \
  && touch /command-history/.bash_history \
  && chown -R $USERNAME /command-history \
  && echo "$SNIPPET" >> "/home/$USERNAME/.bashrc"
