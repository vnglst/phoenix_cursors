defmodule PhoenixCursorsWeb.PageController do
  use PhoenixCursorsWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
