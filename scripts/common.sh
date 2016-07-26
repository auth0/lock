#!/bin/bash

new_line()
{
  echo ""
}

verbose() 
{
  echo -e " \033[36m→\033[0m $1"
}

verbose_item() 
{
  echo -e " \033[96m∙\033[0m $1"
}

success()
{
  echo -e " \033[1;32m✔︎\033[0m $1"
}