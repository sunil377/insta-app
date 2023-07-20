export interface IButton
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {}

export type boolean_dispatch = React.Dispatch<React.SetStateAction<boolean>>
