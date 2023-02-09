import { ReactNode } from "react";
import { CustomRouter } from "../utils/CustomBrowswerRouter";
import customHistory from "../utils/customHistory";
import { render } from "@testing-library/react";


export function renderWithRouter(childNode: ReactNode) {
  return render(
    <CustomRouter history={customHistory}>
    {childNode}
    </CustomRouter>
  )
}