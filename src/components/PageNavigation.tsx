import { I18n } from "@aws-amplify/core";

/**
 * @component PageNavigation
 * @desc Displays options for navigating through a paginated list
 * @param {Prop} currentPage-the current page of results
 * @param {Prop} maxPages-the total number of possible pages of results
 * @param {Prop} increasePage-function to increase the currentPage by 1
 * @param {Prop} decreasePage-function ot decrease the currentPage by 1
 */

interface PageNavigationProps {
  currentPage: number,
  maxPages: number,
  increasePage: () => {},
  decreasePage: () => {}
}

export default function PageNavigation({
  currentPage,
  maxPages,
  increasePage,
  decreasePage,
}: PageNavigationProps) {
  const [nextPage, priorPage] = [currentPage + 1, currentPage - 1];

  return (
    <div
      style={{ display: "flex", justifyContent: "center", fontSize: "12px" }}
    >
      {currentPage <= 1 ? (
        <HiddenNav id="back" label={`< ${I18n.get("back")}`} />
      ) : (
        <VisibleNav
          id="back"
          handleClick={decreasePage}
          label={`< ${I18n.get("back")}`}
        />
      )}
      {currentPage <= 1 ? (
        <HiddenNav id={`page-${priorPage}`} label={priorPage.toString()} />
      ) : (
        <VisibleNav
          id={`page-${priorPage}`}
          handleClick={decreasePage}
          label={priorPage.toString()}
        />
      )}
      {maxPages === 1 ? (
        <HiddenNav id="current-page" label={currentPage.toString()} />
      ) : (
        <VisibleNav id="current-page" label={null}>
          <span
            style={{
              fontWeight: "bold",
              cursor: "default",
              backgroundColor: "lightgray",
              padding: "5px 10px",
              borderRadius: "10px",
            }}
          >
            {currentPage}
          </span>
        </VisibleNav>
      )}
      {currentPage < maxPages ? (
        <VisibleNav
          id={`page-${nextPage}`}
          handleClick={increasePage}
          label={nextPage.toString()}
        />
      ) : (
        <HiddenNav
          id={`page-${nextPage}`}
          label={nextPage > maxPages ? null : nextPage.toString()}
        />
      )}
      {currentPage < maxPages ? (
        <VisibleNav
          id="next"
          handleClick={increasePage}
          label={`${I18n.get("next")} >`}
        />
      ) : (
        <HiddenNav id="next" label={`${I18n.get("next")} >`} />
      )}
    </div>
  );
}

interface HiddenNavProps {
  id: String;
  label: String | null;
  children?: any;
}

interface VisibleNavProps extends HiddenNavProps {
  handleClick?: () => {},
}

function VisibleNav({ handleClick, label, children }: VisibleNavProps) {
  return (
    <p style={{ cursor: "pointer", padding: "0px 15px" }} onClick={handleClick}>
      {label || children}
    </p>
  );
}

function HiddenNav({ label, children }: HiddenNavProps) {
  return (
    <p style={{ opacity: "0.6", padding: "0px 15px" }}>{label || children}</p>
  );
}
