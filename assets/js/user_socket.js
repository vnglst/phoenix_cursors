// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// Bring in Phoenix channels client library:
import {Socket} from "phoenix"

// And connect to the path in "lib/phoenix_cursors_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/phoenix_cursors_web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/phoenix_cursors_web/templates/layout/app.html.heex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/phoenix_cursors_web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1_209_600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()

// Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 42:
let channel = socket.channel("cursor:lobby", {})
channel.join()
  .receive("ok", resp => { 
    console.log("Joined successfully", resp)

    document.addEventListener("mousemove", (e) => {
      const x = e.pageX / window.innerWidth;
      const y = e.pageY / window.innerHeight;
      channel.push("move", { x, y });
    });

    channel.on('move', ({ x, y }) => {
      const ul = document.createElement('ul');
      const cursorLi = cursorTemplate({
        x: x * window.innerWidth,
        y: y * window.innerHeight,
        name: '???'
      });
      ul.appendChild(cursorLi);
      document.getElementById('cursor-list').innerHTML = ul.innerHTML;
    });
  })
  .receive("error", resp => { console.log("Unable to join", resp) })

  function cursorTemplate({ x, y, name }) {
    const li = document.createElement('li');
    li.classList =
      'flex flex-col absolute pointer-events-none whitespace-nowrap overflow-hidden text-pink-300';
    li.style.left = x + 'px';
    li.style.top = y + 'px';
  
    li.innerHTML = `
      <svg
        version="1.1"
        width="25px"
        height="25px"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 21 21">
          <polygon
            fill="black"
            points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6" />
          <polygon
            fill="currentColor"
            points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5"
          />
      </svg>
      <span class="mt-1 ml-4 px-1 text-sm text-pink-300" />
    `;
  
    li.lastChild.textContent = name;
  
    return li;
  }

export default socket
