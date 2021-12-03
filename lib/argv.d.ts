export interface ARGV {
    input: string;
}
declare const argv: (args?: string[]) => ARGV;
export default argv;
