# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: souaguen <souaguen@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/09/27 03:31:43 by souaguen          #+#    #+#              #
#    Updated: 2025/10/01 00:27:13 by souaguen         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM debian:bookworm

RUN apt update && apt upgrade -y \
    && apt install mariadb-server -y

COPY ./my.cnf /etc/mysql/my.cnf
COPY ./50-server.cnf /etc/mysql/mariadb.conf.d

RUN chown mysql:mysql /var/lib/mysql \
    && chown mysql:mysql /home \
    && chown mysql:mysql /run

COPY ./setup.sh /
RUN chmod +x /setup.sh

ENTRYPOINT [ "/setup.sh" ]