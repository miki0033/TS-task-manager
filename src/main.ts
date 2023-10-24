import "./tailwind.css";
import "./style.css";

import * as UserList from "/user-list";
import * as UserForm from "/user-form";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="p-4 max-w-lg mx-auto">
        <h1 class="font-semibold text-3xl mb-4">User list</h1>
        <ul id="users-list" class="flex flex-col gap-3"></ul>
        <hr class="my-5" />
        <h3 class="font-semibold text-3xl mb-4">Add User</h3>
        <div id="add-user" class="flex flex-col gap-3"></div>
    </div>
`;

UserList.render();
UserForm.renderAddUserForm();
