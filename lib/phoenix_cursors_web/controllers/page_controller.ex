defmodule PhoenixCursorsWeb.PageController do
  use PhoenixCursorsWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html",
      user_token:
        Phoenix.Token.sign(PhoenixCursorsWeb.Endpoint, "user socket", Cursor.Names.generate())
    )
  end
end
