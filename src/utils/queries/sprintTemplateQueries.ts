import sanity from "../../libs/sanity";
import { RestAPI } from "@aws-amplify/api-rest";
import { I18n } from "@aws-amplify/core";
import { SprintTemplateMongoDBDoc } from "../../types/ArenaTypes";

/**
 * Getting our potential sprint items from Sanity. Will likely need to replace later.
 */
export async function getSprintTemplateOptionsFromSanity() {
    const query = `*[_type == 'achievement' && !(_id in path("drafts.**"))]`;
  const links = await sanity.fetch(query);
  console.log(links)
    let initialData = {
      Options: {
        name: `${I18n.get("options")}`,
        items: links,
      },
      Morning: {
        name: `${I18n.get("morning")}`,
        items: [],
      },
      Workday: {
        name: `${I18n.get("workday")}`,
        items: [],
      },
      Evening: {
        name: `${I18n.get("evening")}`,
        items: [],
      },
    };
    console.log(initialData)
    return initialData;
  }

  // pulls the /templates api and sets the existing templates
export async function getSprintTemplates(): Promise<SprintTemplateMongoDBDoc[]> {
    return await RestAPI.get("pareto", "/templates", {});
  }

export async function setSprintTemplate(body: object) {
    return await RestAPI.post("pareto", "/templates", { body });
}
  
export async function updateSprintTemplate(id: string, body: object) {
  const response = await RestAPI.put("pareto", `/templates/${id}`, { body });
  return response as SprintTemplateMongoDBDoc;
}

export async function deleteSprintTemplate(id: string) {
  return (await RestAPI.del("pareto", `/templates/${id}`, {})) as SprintTemplateMongoDBDoc;
}