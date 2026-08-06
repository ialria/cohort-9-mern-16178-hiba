import {
  Underline,
  Bold,
  Italic,
  List,
  Heading,
} from "./../../../../icons/icons.jsx";
import Button from "../../../../components/Button.jsx";
import ToolTip from "../../../../components/ToolTip.jsx";

function EditorToolButton(){
    return (    <div className="flex gap-2 px-4 md:px-10 w-full">
        <ToolTip text="Bold">
          <Button className="bg-text-disabled transition-all duration-200 text-primary hover:bg-primary hover:text-surface">
            <Bold  className="w-3 h-3 md:w-4 md:h-4" strokeWidth={2} />
          </Button>
        </ToolTip>
        <ToolTip  text="Italic">
        
          <Button className="bg-text-disabled transition-all duration-200 text-primary hover:bg-primary hover:text-surface">
            <Italic  className="w-3 h-3 md:w-4 md:h-4" strokeWidth={2} />
          </Button>
        </ToolTip>

        <ToolTip text="Underline">
          <Button className="bg-text-disabled transition-all duration-200 text-primary hover:bg-primary hover:text-surface">
            <Underline  className="w-3 h-3 md:w-4 md:h-4" strokeWidth={2} />
          </Button>
        </ToolTip>
        <ToolTip text="List">
          <Button className="bg-text-disabled transition-all duration-200 text-primary hover:bg-primary hover:text-surface">
            <List  className="w-3 h-3 md:w-4 md:h-4" strokeWidth={2} />
          </Button>
        </ToolTip>
        <ToolTip text="Heading">
          <Button className="bg-text-disabled transition-all duration-200 text-primary hover:bg-primary hover:text-surface">
            <Heading  className="w-3 h-3 md:w-4 md:h-4" strokeWidth={2} />
          </Button>
        </ToolTip>
      </div>);
}

export default EditorToolButton