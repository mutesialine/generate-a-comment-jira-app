import api, { route } from "@forge/api";

export const run = async (event, context) => {
  const response = await addComment(
    event.issue.id,
    "Thank you for creating an issue."
  );
  console.log(`Response: ${JSON.stringify(response)}`);
};

const addComment = async (issueIdOrKey: string, message: string) => {
  const requestUrl = route`/rest/api/3/issue/${issueIdOrKey}/comment`;
  const body = {
    body: {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              text: message,
              type: "text",
            },
          ],
        },
      ],
    },
  };

  let response = await api.asApp().requestJira(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(body),
  });
  if (response.status !== 201) {
    console.log(response.status);
    throw `Unable to add comment to issueId ${issueIdOrKey} Status: ${response.status}.`;
  }

  return response.json();
};
