
/**
 * Represents the configuration for connecting to a Moodle instance.
 */
export interface MoodleConfig {
  /**
   * The URL of the Moodle API endpoint.
   */
  url: string;
  /**
   * The API key for authenticating with the Moodle API.
   */
  apiKey: string;
    /**
     * The API key for authenticating with the Moodle API.
     */
    language: string;
}

/**
 * Represents the parameters required for a Moodle API function call.
 */
export interface MoodleFunctionParams {
  [key: string]: string | number | boolean | string[];
}

/**
 * Represents the response from a Moodle API function call.
 */
export interface MoodleResponse {
  /**
   * The data returned by the Moodle API.
   */
  data: any;
  /**
   * Optional debugging messages.
   */
  debug?: string[];
}

/**
 * Represents a Moodle API function.
 */
export interface MoodleFunction {
  /**
   * The name of the function.
   */
  name: string;
  /**
   * A description of what the function does.
   */
  description: string;
  /**
   * The parameters that the function accepts.
   */
  parameters: MoodleParameter[];
}

/**
 * Represents a Moodle API parameter.
 */
export interface MoodleParameter {
  /**
   * The name of the parameter.
   */
  name: string;
  /**
   * The type of the parameter.
   */
  type: string;
  /**
   * The possible values for the parameter, if it is a select.
   */
  possibleValues?: string[];
  /**
   * Whether the parameter is required or not.
   */
  required: boolean;
}

/**
 * Calls a Moodle API function with the given parameters.
 *
 * @param config The configuration for connecting to the Moodle instance.
 * @param functionName The name of the function to call.
 * @param params The parameters to pass to the function.
 * @returns A promise that resolves to the Moodle response.
 */
export async function callMoodleApi(
  config: MoodleConfig,
  functionName: string,
  params: MoodleFunctionParams
): Promise<MoodleResponse> {
  const {url, apiKey} = config;
    const apiUrl = `${url}?wsfunction=${functionName}&wstoken=${apiKey}&moodlewsrestformat=json`;

    let formData = new FormData();
    Object.keys(params).forEach(key => {
        formData.append(key, params[key].toString());
    });

    try {
        // Mock API call
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error:any) {
        console.error("API call failed:", error);
        throw new Error(error.message || 'API call failed');
    }
}

/**
 * Retrieves the list of Moodle API functions.
 *
 * @param config The configuration for connecting to the Moodle instance.
 * @returns A promise that resolves to the list of Moodle API functions.
 */
export async function getMoodleFunctions(config: MoodleConfig): Promise<MoodleFunction[]> {
  // TODO: Implement this by calling the Moodle API or scraping the Moodle documentation.
  console.log("Getting Moodle functions", config);

  return [
    {
      name: "core_user_get_users_by_field",
      description:
        "Retrieve users' information for a specified unique field - If you want to do a user search, use core_user_get_users() or core_user_search_identity().",
      parameters: [
        {
          name: "field",
          type: "string",
          possibleValues: ["id", "idnumber", "username", "email"],
          required: true,
        },
        {
          name: "values",
          type: "string[]",
          required: true,
        },
      ],
    },
  ];
}
